import cv2
import face_recognition
import math
from sklearn import neighbors
import os
import pickle
import numpy as np
from collections import Counter
import dlib
import sys
import boto3
from pydantic import BaseModel, EmailStr
import requests
from pymongo import MongoClient
import json
import logging
import subprocess
from pathlib import Path
import shutil

# secret.json 파일에서 환경 변수를 로드
with open('../config/secrets.json') as f:
    secrets = json.load(f)

FAST_API_USER_IP = secrets["FAST_API_USER_IP"]

# 사용자 정보를 저장하기 위한 Pydantic 모델
class User(BaseModel):
    email: EmailStr
    name: str

# MongoDB 설정
MONGODB_ID_F = secrets["MONGODB_ID_F"]
MONGODB_PASSWORD_F = secrets["MONGODB_PASSWORD_F"]
MONGODB_PORT_F = secrets["MONGODB_PORT_F"]
MONGODB_TEST_F = secrets["MONGODB_TEST_F"]

# AWS S3 설정
S3_ACCESS_KEY_ID_F = secrets["S3_ACCESS_KEY_ID_F"]
S3_SECRET_ACCESS_KEY_F = secrets["S3_SECRET_ACCESS_KEY_F"]
S3_BUCKET_NAME_F = secrets["S3_BUCKET_NAME_F"]
S3_REGION_F = secrets["S3_REGION_F"]

# S3 설정
s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_KEY_ID_F,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY_F,
    region_name=S3_REGION_F
)
bucket_name = S3_BUCKET_NAME_F

# MongoDB 설정
mongo_client = MongoClient(f"mongodb://{MONGODB_ID_F}:{MONGODB_PASSWORD_F}@{MONGODB_TEST_F}:{MONGODB_PORT_F}")
db = mongo_client["videos"]
collection = db["video"]

# dlib 모델 로드
detector = dlib.get_frontal_face_detector()
sp = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
facerec = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")

# 허용되는 파일 확장자 설정
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4'}

# 로거 설정 함수
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

# 함수들

# 파일을 S3에 업로드
def upload_to_s3(file_path, worknum):
    s3_path = f"{worknum}/{os.path.basename(file_path)}"
    s3_client.upload_file(file_path, bucket_name, s3_path)
    s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_path}"
    return s3_url

# 얼굴 인식 모델을 훈련시키는 함수
def train(train_dir, model_save_path=None, n_neighbors=None, knn_algo='ball_tree', verbose=False):
    logger = logging.getLogger()
    X, y = [], []

    try:
        for class_dir in os.listdir(train_dir):
            logger.info(f"Processing {class_dir} ...")
            if not os.path.isdir(os.path.join(train_dir, class_dir)):
                continue

            if not class_dir.startswith(worknum):
                continue

            for img_path in os.listdir(os.path.join(train_dir, class_dir)):
                if img_path.split('.')[-1] not in ALLOWED_EXTENSIONS:
                    continue
                image = face_recognition.load_image_file(os.path.join(train_dir, class_dir, img_path))
                face_bounding_boxes = face_recognition.face_locations(image)

                if len(face_bounding_boxes) == 1:
                    X.append(face_recognition.face_encodings(image, known_face_locations=face_bounding_boxes)[0])
                    y.append(class_dir)
                elif verbose:
                    logger.info(f"Image {img_path} not suitable for training: {'Didn’t find a face' if len(face_bounding_boxes) < 1 else 'Found more than one face'}")

        n_neighbors = n_neighbors or int(round(math.sqrt(len(X))))
        if verbose:
            logger.info(f"Chose n_neighbors automatically: {n_neighbors}")

        knn_clf = neighbors.KNeighborsClassifier(n_neighbors=n_neighbors, algorithm=knn_algo, weights='distance')
        knn_clf.fit(X, y)

        if model_save_path:
            with open(model_save_path, 'wb') as f:
                pickle.dump(knn_clf, f)
        logger.info("Training completed successfully")
        return knn_clf

    except Exception as e:
        logger.error(f"Training failed: {e}")
        return None

# 프레임에서 얼굴을 예측하는 함수
def predict_frame(frame, knn_clf=None, model_path=None, distance_threshold=0.45):
    if knn_clf is None and model_path:
        with open(model_path, 'rb') as f:
            knn_clf = pickle.load(f)

    X_face_locations = face_recognition.face_locations(frame)
    if not X_face_locations:
        return []

    faces_encodings = face_recognition.face_encodings(frame, known_face_locations=X_face_locations)
    closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=1)
    are_matches = [closest_distances[0][i][0] <= distance_threshold for i in range(len(X_face_locations))]

    return [(pred, loc) if rec else ("unknown", loc) for pred, loc, rec in zip(knn_clf.predict(faces_encodings), X_face_locations, are_matches)]

# 모자이크 처리를 하는 함수
def mosaic(image, top, right, bottom, left, strength=10):
    face = image[top:bottom, left:right]
    face = cv2.resize(face, (strength, strength), interpolation=cv2.INTER_LINEAR)
    face = cv2.resize(face, (right - left, bottom - top), interpolation=cv2.INTER_NEAREST)
    image[top:bottom, left:right] = face
    return image

# 예측 레이블을 이미지에 표시하는 함수
def show_prediction_labels_on_image(frame, predictions):
    for name, (top, right, bottom, left) in predictions:
        if name == "unknown":
            frame = mosaic(frame, top, right, bottom, left, strength=10)
    return frame

# 레이블을 수정하는 함수
def correct_labels(all_predictions, frame_count, window_size=10, threshold=5):
    if frame_count < window_size:
        return all_predictions[-1]

    window_predictions = all_predictions[-window_size:]
    labels = [label for preds in window_predictions for label, _ in preds]
    label_counts = Counter(labels)

    if not label_counts:
        return all_predictions[-1]

    most_common_label = label_counts.most_common(1)[0][0]

    corrected_predictions = []
    for preds in window_predictions:
        corrected_preds = [(most_common_label, loc) if label_counts[label] <= threshold else (label, loc) for label, loc in preds]
        corrected_predictions.append(corrected_preds)

    return corrected_predictions[-1]

# 비디오를 처리하는 함수
def process_video(input_video_path, output_video_name, knn_clf, worknum, window_size=10, threshold=4):
    logger = init_logger(worknum)

    try:
        cap = cv2.VideoCapture(input_video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        if not cap.isOpened():
            logger.error(f"Error: Unable to open video file {input_video_path}")
            collection.update_one({"worknum": worknum}, {"$set": {"job_ok": -1}})
            raise Exception(f"Error: Unable to open video file {input_video_path}")

        os.makedirs('output_frames', exist_ok=True)

        frame_count, saved_frame_count, all_predictions = 0, 0, []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_count % 1 == 0:
                predictions = predict_frame(frame, knn_clf=knn_clf)
                all_predictions.append(predictions)
                corrected_predictions = correct_labels(all_predictions, frame_count, window_size, threshold)

                frame_with_predictions = show_prediction_labels_on_image(frame, corrected_predictions)
                frame_filename = f"output_frames/frame_{saved_frame_count:04d}.jpg"
                cv2.imwrite(frame_filename, frame_with_predictions)
                logger.info(f"Saved frame {frame_count} as JPG")

                saved_frame_count += 1

            frame_count += 1

        cap.release()

        base_filename = os.path.splitext(output_video_name)[0]
        audio_exists = check_audio_track(input_video_path)

        if audio_exists:
            video_path = f"knn_examples/output/{base_filename}_video.mp4"
            audio_path = f"knn_examples/output/{base_filename}_audio.mp3"

            os.makedirs(os.path.dirname(video_path), exist_ok=True)
            
            # 오디오가 있는 경우 비디오 생성
            command = f"ffmpeg -r {fps} -i output_frames/frame_%04d.jpg -vcodec libx264 -pix_fmt yuv420p {video_path}"
            run_command(command, logger, worknum)

            # 오디오 트랙 추출
            command = f"ffmpeg -i {input_video_path} -q:a 0 -map a {audio_path}"
            run_command(command, logger, worknum)

            final_output = f"knn_examples/output/{output_video_name}" if output_video_name.endswith('.mp4') else f"knn_examples/output/{output_video_name}.mp4"
            command = f"ffmpeg -i {video_path} -i {audio_path} -c:v copy -c:a aac -strict experimental {final_output}"
        else:
            video_path = f"knn_examples/output/{base_filename}.mp4"

            os.makedirs(os.path.dirname(video_path), exist_ok=True)
            
            # 오디오가 없는 경우 비디오 생성
            command = f"ffmpeg -r {fps} -i output_frames/frame_%04d.jpg -vcodec libx264 -pix_fmt yuv420p {video_path}"
            final_output = video_path

        run_command(command, logger, worknum)

        # output_frames 디렉토리 삭제
        for file_name in os.listdir('output_frames'):
            file_path = os.path.join('output_frames', file_name)
            if os.path.isfile(file_path):
                os.unlink(file_path)
        try:
            os.rmdir('output_frames')
        except Exception as e:
            logger.error(f"Error removing output_frames directory: {e}")

        s3_url = upload_to_s3(final_output, worknum)
        collection.update_one({"worknum": worknum}, {"$set": {"s3_url": s3_url, "job_ok": 2}})

        logger.info(f"Uploaded video to S3: {s3_url}")
        print(s3_url)

        # 비디오 처리 완료 후 파일 삭제
        cleanup_files()

    except Exception as e:
        logger.error(f"An unexpected error occurred during video processing: {e}")
        collection.update_one({"worknum": worknum}, {"$set": {"job_ok": -1}})
        print("Processing failed...")
        raise

def cleanup_files():
    # train 디렉토리 정리
    train_dir = Path("knn_examples/train")
    if train_dir.exists() and train_dir.is_dir():
        print(f"Deleting train directory: {train_dir}")
        shutil.rmtree(train_dir)
    else:
        print(f"Train directory does not exist or is not a directory: {train_dir}")
    
    # test 디렉토리 정리
    test_dir = Path("knn_examples/test")
    if test_dir.exists() and test_dir.is_dir():
        print(f"Deleting test directory: {test_dir}")
        shutil.rmtree(test_dir)
    else:
        print(f"Test directory does not exist or is not a directory: {test_dir}")

    # output 디렉토리 정리
    output_dir = Path("knn_examples/output")
    if output_dir.exists() and output_dir.is_dir():
        print(f"Deleting output directory: {output_dir}")
        shutil.rmtree(output_dir)
    else:
        print(f"Output directory does not exist or is not a directory: {output_dir}")

def check_audio_track(video_path):
    try:
        result = subprocess.run(
            ["ffmpeg", "-i", video_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return "Audio:" in result.stderr
    except Exception as e:
        print(f"Error checking audio track: {e}")
        return False

def run_command(command, logger, worknum):
    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, shell=True)
        logger.info(f"Command output: {result.stdout}")
        logger.info(f"Command error (if any): {result.stderr}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Command failed: {command}\nError: {e.stderr}")
        collection.update_one({"worknum": worknum}, {"$set": {"job_ok": -1}})
        print("Processing failed...")
        raise

##작업 이메일 보내기
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


if __name__ == "__main__":
    input_video_path = sys.argv[1]
    output_video_name = sys.argv[2]
    worknum = sys.argv[3]

    try:
        # 기존 확장자가 중복되지 않도록 처리
        output_video_name = output_video_name.replace('.mp4', '')
        
        print("Training KNN classifier...")
        logger = init_logger(worknum)
        logger.info("Training KNN classifier...")

        classifier = train("knn_examples/train", model_save_path="trained_knn_model.clf", n_neighbors=3)

        print("Training complete!")
        logger.info("Training complete!")

        print(f"Processing video {input_video_path}")
        logger.info(f"Processing video {input_video_path}")

        process_video(input_video_path, output_video_name, classifier, worknum)

        print("Processing complete!")
        logger.info("Processing complete!")
    except Exception as e:
        collection.update_one({"worknum": worknum}, {"$set": {"job_ok": -1}})
        logger.error(f"An unexpected error occurred: {e}")
        print(f"An unexpected error occurred: {e}")
        print("Processing failed...")