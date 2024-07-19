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

# secret.json 파일에서 환경 변수를 로드
with open('secrets.json') as f:
    secrets = json.load(f)

FAST_API_USER= secrets["FAST_API_USER_IP"]


# 사용자 정보를 저장하기 위한 Pydantic 모델
class User(BaseModel):
    email: EmailStr
    name: str

# MongoDB 설정
MONGODB_ID_F = secrets["MONGODB_ID_F"]
MONGODB_PASSWORD_F = secrets["MONGODB_PASSWORD_F"]
MONGODB_PORT_F = secrets["MONGODB_PORT_F"]

# AWS S3 설정
S3_ACCESS_KEY_ID_F = secrets["S3_ACCESS_KEY_ID_F"]
S3_SECRET_ACCESS_KEY_F = secrets["S3_SECRET_ACCESS_KEY_F"]
S3_BUCKET_NAME_F = secrets["S3_BUCKET_NAME_F"]
S3_REGION_F = secrets["S3_REGION_F"]

#S3 설정
s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_KEY_ID_F,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY_F,
    region_name=S3_REGION_F
)
bucket_name = S3_BUCKET_NAME_F

# MongoDB 설정
mongo_client = MongoClient(f"mongodb://{MONGODB_ID_F}:{MONGODB_PASSWORD_F}@mongo_f:{MONGODB_PORT_F}")
db = mongo_client["videos"]
collection = db["video"]

# dlib 모델 로드
detector = dlib.get_frontal_face_detector()
sp = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
facerec = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")

# 허용되는 파일 확장자 설정
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4'}

# 파일을 S3에 업로드
def upload_to_s3(file_path, worknum):
    s3_path = f"{worknum}/{os.path.basename(file_path)}"
    s3_client.upload_file(file_path, bucket_name, s3_path)
    s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_path}"
    return s3_url

# 얼굴 인식 모델을 훈련시키는 함수
def train(train_dir, model_save_path=None, n_neighbors=None, knn_algo='ball_tree', verbose=False):
    X, y = [], []

    for class_dir in os.listdir(train_dir):
        print(f"Processing {class_dir} ...")
        if not os.path.isdir(os.path.join(train_dir, class_dir)):
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
                print(f"Image {img_path} not suitable for training: {'Didn’t find a face' if len(face_bounding_boxes) < 1 else 'Found more than one face'}")

    n_neighbors = n_neighbors or int(round(math.sqrt(len(X))))
    if verbose:
        print(f"Chose n_neighbors automatically: {n_neighbors}")

    knn_clf = neighbors.KNeighborsClassifier(n_neighbors=n_neighbors, algorithm=knn_algo, weights='distance')
    print("-----------------------------")
    print(X)
    print(y)
    print("-----------------------------")
    knn_clf.fit(X, y)

    if model_save_path:
        with open(model_save_path, 'wb') as f:
            pickle.dump(knn_clf, f)

    return knn_clf

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
    cap = cv2.VideoCapture(input_video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    if not cap.isOpened():
        print(f"Error: Unable to open video file {input_video_path}")
        return

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
            print(f"Saved frame {frame_count} as JPG")

            saved_frame_count += 1

        frame_count += 1

    cap.release()

    # 영상 파일명 및 오디오 파일명 처리
    base_filename = os.path.splitext(output_video_name)[0]
    video_path = f"knn_examples/output/{base_filename}_video.mp4"
    audio_path = f"knn_examples/output/{base_filename}_audio.mp3"

    os.makedirs(os.path.dirname(video_path), exist_ok=True)
    os.system(f"ffmpeg -r {fps} -i output_frames/frame_%04d.jpg -vcodec libx264 -pix_fmt yuv420p {video_path}")

    os.system(f"ffmpeg -i {input_video_path} -q:a 0 -map a {audio_path}")

    final_output = f"knn_examples/output/{output_video_name}" if output_video_name.endswith('.mp4') else f"knn_examples/output/{output_video_name}.mp4"
    os.system(f"ffmpeg -i {video_path} -i {audio_path} -c:v copy -c:a aac -strict experimental {final_output}")

    for file_name in os.listdir('output_frames'):
        file_path = os.path.join('output_frames', file_name)
        if os.path.isfile(file_path):
            os.unlink(file_path)
    os.rmdir('output_frames')

    s3_url = upload_to_s3(final_output, worknum)
    collection.update_one({"worknum": worknum}, {"$set": {"s3_url": s3_url}})

    print(s3_url)
    
    responsfinish = requests.put(f'{FAST_API_USER}/finishprocess?worknum={worknum}')
    responsfinish = responsfinish.json()
    print(responsfinish)

    if responsfinish == 0:        
        print('작업 완료 이메일X')
    else:
        email = responsfinish['email']
        name = responsfinish['name']
        data = User(email=email, name=name)

        url = f"{FAST_API_USER}/sendemail"
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }

        responsemail = requests.post(url, headers=headers, json=data.dict())

        print('작업 완료 이메일 전송')
        print(responsemail.json())


# 메인 함수 : 비디오 처리 파이프라인 실행
if __name__ == "__main__":
    input_video_path = sys.argv[1]
    output_video_name = sys.argv[2]
    worknum = sys.argv[3]

    # 기존 확장자가 중복되지 않도록 처리
    output_video_name = output_video_name.replace('.mp4', '')
    
    print("Training KNN classifier...")
    classifier = train("knn_examples/train", model_save_path="trained_knn_model.clf", n_neighbors=3)
    print("Training complete!")

    print(f"Processing video {input_video_path}")
    process_video(input_video_path, output_video_name, classifier, worknum)
    print("Processing complete!")
