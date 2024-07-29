import cv2
import subprocess
import os
import json
import requests
from app.config import s3_client, bucket_name
from app.database import update_video_document
from app.models import User, ErrorRequest
from ultralytics import YOLO
import logging

# 시크릿 제이슨 파일에서 환경 변수를 로드
with open('../config/secrets.json') as f:
    secrets = json.load(f)

FAST_API_USER_IP= secrets['FAST_API_USER_IP']

# YOLO 모델 로드
model_M = YOLO("yolomodel/addf2.pt")
model_P = YOLO("yolomodel/card2.pt")

# 클래스 이름 정의
class_names_M = ['knife', 'handgun', 'cigarette', 'fuckyou']
class_names_P = ['car_LP', 'CreditCards', 'Receipt']

def init_logger(worknum):
    logger = logging.getLogger(worknum)
    logger.setLevel(logging.INFO)
    
    # 파일 핸들러 설정
    if not os.path.exists("logs"):
        os.makedirs("logs")

    log_file = os.path.join("logs", f"{worknum}.log")
    fh = logging.FileHandler(log_file, encoding='utf-8')
    fh.setLevel(logging.INFO)
    
    # 로그 포맷 설정
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    
    # 핸들러 추가
    logger.addHandler(fh)
    
    # 터미널 로그 제거
    logger.propagate = False
    
    return logger

def encode_video(video_path):
    try:
        if not os.path.exists("processed_videos"):
            os.makedirs("processed_videos")

        new_video_path = os.path.join("processed_videos", f'encoded_{os.path.basename(video_path)}')
        command = [
            "ffmpeg",
            "-i", video_path,
            "-c:v", "libx264",
            "-c:a", "aac",
            "-strict", "experimental",
            new_video_path
        ]
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return new_video_path
    except subprocess.CalledProcessError as e:
        print("비디오 인코딩 실패:", e)
        return None

def add_audio_to_video(original_video, processed_video, output_video):
    try:
        # Check if the original video has an audio track
        command = [
            "ffprobe",
            "-i", original_video,
            "-show_streams",
            "-select_streams", "a",
            "-loglevel", "error"
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        has_audio = bool(result.stdout.strip())

        # Construct the ffmpeg command based on whether the original video has audio
        if has_audio:
            command = [
                "ffmpeg",
                "-i", processed_video,
                "-i", original_video,
                "-c:v", "copy",
                "-c:a", "aac",
                "-strict", "experimental",
                "-map", "0:v:0",
                "-map", "1:a:0",
                output_video
            ]
        else:
            command = [
                "ffmpeg",
                "-i", processed_video,
                "-c:v", "copy",
                output_video
            ]
        
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print("오디오 추가 실패:", e)
        return False


def upload_to_s3(file_path, worknum):
    try:
        s3_path = f"{worknum}/{os.path.basename(file_path)}"
        s3_client.upload_file(file_path, bucket_name, s3_path)
        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_path}"

        return s3_url
    except Exception as e:
        print("S3 업로드 실패:", e)
        return None

def apply_mosaic(image, x1, y1, x2, y2, strength, logger):
    while True:
        roi = image[y1:y2, x1:x2]
        roi_height, roi_width = roi.shape[:2]

        if roi_width == 0 or roi_height == 0:
            logger.warning(f"유효하지 않은 ROI 크기: ({x1}, {y1}), ({x2}, {y2})")
            return image

        try:
            small = cv2.resize(roi, (strength, strength), interpolation=cv2.INTER_LINEAR)
            break
        except cv2.error as e:
            strength -= 5
            if strength <= 0:
                logger.error("모자이크 강도가 너무 낮습니다. 강도를 재설정합니다.")
                return image

    mosaic = cv2.resize(small, (x2 - x1, y2 - y1), interpolation=cv2.INTER_NEAREST)
    image[y1:y2, x1:x2] = mosaic

    return image

def process_video(worknum, video_path, filename, power, mosaic_strength, labels):
    labels = labels[0].replace('credit_card', 'CreditCards')
    labels = labels.replace('gun', 'handgun')
    labels = labels.replace('middle_finger', 'fuckyou')
    labels = labels.replace('receipt', 'Receipt')
    labels = labels.replace('license_plate', 'car_LP')
    labels = labels.split(',')

    output_path=None
    encoded_video_path = None
    json_path = None
    final_output_path=None


    logger = init_logger(worknum)
    logger.info(f"작업 라벨 {labels}에 대한 비디오 처리 시작")

    


    responsestart = requests.get(f'{FAST_API_USER_IP}/updateprocess?worknum={worknum}')
    print(f"responsestart.text: {responsestart.text}")

    if responsestart.text == '1':
        try:
            if worknum.startswith('M'):
                model = model_M
                class_names = class_names_M
                logger.info("model_M 선택됨")
            elif worknum.startswith('P'):
                model = model_P
                class_names = class_names_P
                logger.info("model_P 선택됨")
            else:
                raise ValueError(f"알 수 없는 작업 번호 접두사")

            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise FileNotFoundError(f"비디오 파일을 열 수 없습니다")

            if not os.path.exists("processed_videos"):
                os.makedirs("processed_videos")


            output_path = os.path.join("processed_videos", f"processed_{os.path.basename(video_path)}")
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            frame_rate= cap.get(cv2.CAP_PROP_FPS)
            out = cv2.VideoWriter(output_path, fourcc,frame_rate, (int(cap.get(3)), int(cap.get(4))))

            detection_results = []

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                frame_number = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
                timestamp = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000

                results = model(frame, verbose=False)  # 로그 출력 억제

                frame_results = []
                for result in results[0].boxes:
                    if (result.conf >= float(power)) and (class_names[int(result.cls)] in labels):
                        x1, y1, x2, y2 = map(int, result.xyxy[0])
                        logger.info(f"탐지됨: {class_names[int(result.cls)]}, 신뢰도: {result.conf}, 좌표: ({x1}, {y1}), ({x2}, {y2})")
                        frame = apply_mosaic(frame, x1, y1, x2, y2, mosaic_strength, logger)
                        frame_results.append({
                            "class": class_names[int(result.cls)],
                            "confidence": float(result.conf),
                            "coordinates": [x1, y1, x2, y2]
                        })

                if frame_results:
                    detection_results.append({
                        "timestamp": timestamp,
                        "frame_number": frame_number,
                        "detections": frame_results
                    })

                out.write(frame)

            cap.release()
            out.release()

            json_path = os.path.join("processed_videos", f"detection_results_{worknum}.json")
            with open(json_path, 'w') as json_file:
                json.dump(detection_results, json_file, indent=4)

        except Exception as e:
            logger.error(f"비디오 처리 중 오류 발생: {e}")
            handle_error(worknum, video_path, output_path, json_path, None, None, filename, str(e))

            return

        try:
            logger.info("비디오 인코딩 시작")
            encoded_video_path = encode_video(output_path)
            if not encoded_video_path:
                raise RuntimeError("비디오 인코딩 실패")

            if not os.path.exists("complete"):
                os.makedirs("complete")

            if filename.endswith('.mp4'):
                final_output_path = os.path.join("complete", filename)
            else:
                final_output_path = os.path.join("complete", filename + '.mp4')

            logger.info("비디오에 오디오 추가 시작")
            if not add_audio_to_video(video_path, encoded_video_path, final_output_path):
                raise RuntimeError("오디오 추가 실패")

            s3_url = upload_to_s3(final_output_path, worknum)
            if not s3_url:
                raise RuntimeError("S3 업로드 실패")

            logger.info(f"s3에 저장됨: {s3_url}")

            with open(json_path, 'r') as file:
                data = json.load(file)

            object_times = {}
            for entry in data:
                timestamp = entry['timestamp']
                detections = entry.get('detections', [])

                for detection in detections:
                    class_name = detection['class']
                    if class_name in object_times:
                        object_times[class_name].append(timestamp)
                    else:
                        object_times[class_name] = [timestamp]

            object_durations = {}
            for class_name, timestamps in object_times.items():
                unique_timestamps = set(timestamps)
                duration = len(unique_timestamps) / frame_rate
                object_durations[class_name] = duration

            knifecount = object_durations.get('knife', 0)
            guncount = object_durations.get('handgun', 0)
            cigarettecount = object_durations.get('cigarette', 0)
            middle_fingercount = object_durations.get('fuckyou', 0)
            credit_cardcount = object_durations.get('CreditCards', 0)
            receiptcount = object_durations.get('Receipt', 0)
            license_platecount = object_durations.get('car_LP', 0)

            update_video_document(worknum, {
                "job_ok": 1,
                "s3_url": s3_url,
                "knife": round(knifecount, 2),
                "gun": round(guncount, 2),
                "cigarette": round(cigarettecount, 2),
                "middle_finger": round(middle_fingercount, 2),
                "credit_card": round(credit_cardcount, 2),
                "receipt": round(receiptcount, 2),
                "license_plate": round(license_platecount, 2)
            })

            logger.info("MongoDB에 비디오 문서 업데이트 완료")

            # 임시 파일 제거

            if os.path.exists(encoded_video_path):
                os.remove(encoded_video_path)
            if os.path.exists(output_path):
                os.remove(output_path)
            if os.path.exists(json_path):
                os.remove(json_path)
            if os.path.exists(final_output_path):
                os.remove(final_output_path)
            if os.path.exists(video_path):
                os.remove(video_path)


            try:
                responsfinish = requests.put(f'{FAST_API_USER_IP}/finishprocess?worknum={worknum}')
                responsfinish = responsfinish.json()

                if responsfinish == 0:
                    logger.info('작업 완료 이메일X')
                    print('작업 완료 이메일X')
                else:
                    email = responsfinish['email']
                    name = responsfinish['name']
                    data = User(email=email, name=name)

                    url = f"{FAST_API_USER_IP}/sendemail"
                    headers = {
                        "accept": "application/json",
                        "Content-Type": "application/json"
                    }

                    responsemail = requests.post(url, headers=headers, json=data.dict())
                    logger.info('작업 완료 이메일 전송')
                    print('작업 완료 이메일 전송')
                    logger.info(responsemail.json())
            except requests.RequestException as e:
                logger.error(f"작업 완료 요청 실패: {e}")

        except Exception as e:
            logger.error(f"비디오 처리 후 작업 중 오류 발생: {e}")
            handle_error(worknum, video_path, output_path, json_path, encoded_video_path, final_output_path, filename, str(e))

        finally:
            # 임시 파일 제거
            try:
                if encoded_video_path and os.path.exists(encoded_video_path):
                    os.remove(encoded_video_path)
                if output_path and os.path.exists(output_path):
                    os.remove(output_path)
                if json_path and os.path.exists(json_path):
                    os.remove(json_path)
                if final_output_path and os.path.exists(final_output_path):
                    os.remove(final_output_path)
                if video_path and os.path.exists(video_path):
                    os.remove(video_path)

            except OSError as e:
                logger.error(f"임시 파일 제거 실패: {e}")
            
    
    else:
        logger.info('삭제된 작업')
        if os.path.exists(video_path):
            os.remove(video_path)
        print(f'{worknum} 삭제된 작업')


def handle_error(worknum, video_path, output_path, json_path, encoded_video_path, final_output_path, filename, error_message):
    logger = init_logger(worknum)
    logger.error(f"작업 중 오류 발생: {error_message}")


    responseerror = requests.put(f'{FAST_API_USER_IP}/errorprocess?worknum={worknum}')
    responseerror = responseerror.json()

    
    if responseerror == 0:
        logger.info('작업 완료 이메일X')
        print('작업 완료 이메일X')
    
    else:
        email = responseerror['email']
        name = responseerror['name']
        data = ErrorRequest(email=email, name=name, content=error_message)
        logger.error(data.dict())

        errorurl = f"{FAST_API_USER_IP}/senderroremail"
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
        }

        senderroremail = requests.post(errorurl, headers=headers, json=data.dict())
        logger.info('오류 발생 이메일 전송 완료')
        print('오류 발생 이메일 전송 완료')
        logger.info(senderroremail.json())

    # MongoDB에 오류 기록
    update_video_document(worknum, {
        "job_ok": -1,
        "error_message": error_message
    })
    logger.info("MongoDB에 오류 정보 업데이트 완료")
    

    # 임시 파일 제거

    if encoded_video_path and os.path.exists(encoded_video_path):
        os.remove(encoded_video_path)
    if output_path and os.path.exists(output_path):
        os.remove(output_path)
    if json_path and os.path.exists(json_path):
        os.remove(json_path)
    if final_output_path and os.path.exists(final_output_path):
        os.remove(final_output_path)
    if video_path and os.path.exists(video_path):
        os.remove(video_path)

    
        

