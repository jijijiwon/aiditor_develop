##0730 main.py -4

from fastapi import FastAPI, UploadFile, HTTPException, File, Form
from fastapi.responses import JSONResponse
from typing import List
import subprocess
import os
import shutil
import boto3
from pathlib import Path
from pymongo import MongoClient
import json
import queue
import threading
import requests

# 기본 설정 로드
with open('../config/secrets.json') as f:
    secrets = json.load(f)

FAST_API_USER_IP = secrets['FAST_API_USER_IP']

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

# FastAPI 앱 설정
app = FastAPI()

# S3 클라이언트 설정
s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_KEY_ID_F,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY_F,
    region_name=S3_REGION_F
)
bucket_name = S3_BUCKET_NAME_F

# MongoDB 클라이언트 설정
mongo_client = MongoClient(f"mongodb://{MONGODB_ID_F}:{MONGODB_PASSWORD_F}@{MONGODB_TEST_F}:{MONGODB_PORT_F}")
db = mongo_client["videos"]
collection = db["video"]

# 비디오 처리 큐 생성
video_queue = queue.Queue()

# 작업 번호로 비디오 문서를 MongoDB에서 찾기
def find_video_document(worknum):
    return collection.find_one({"worknum": worknum})

# 비디오 큐에서 작업을 처리
def process_video_from_queue():
    while True:
        item = video_queue.get()
        if item is None:
            break
        process_video(item)
        video_queue.task_done()

# 비디오 처리 작업을 수행
def process_video(item):
    file_location, filename, worknum = item
    try:
        # 비디오 처리 상태를 업데이트하기 위해 외부 API에 GET 요청을 보냄
        response = requests.get(f'{FAST_API_USER_IP}/updateprocess?worknum={worknum}')
        print(f"response.text: {response.text}")
        
        # 응답 텍스트가 '1'인 경우에만 비디오 처리 시작
        if response.text == '1':
            # 작업 상태를 '처리 중'으로 업데이트
            collection.update_one({"worknum": worknum}, {"$set": {"job_ok": 1}})
            
            process = subprocess.Popen(
                ["python3", "test_blur_app.py", str(file_location), filename, worknum],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            # 실시간으로 출력 읽기
            while True:
                output = process.stdout.readline()
                if output == "" and process.poll() is not None:
                    break
                if output:
                    print(output.strip())

            stderr = process.stderr.read()
            if process.returncode != 0:
                print(f"Error occurred while running test_blur_app.py: {stderr.strip()}")
                # 작업 상태를 '에러'로 업데이트
                collection.update_one({"worknum": worknum}, {"$set": {"job_ok": -1}})
                print("Processing failed...")
                return
            
            # 비디오 처리 완료 후 파일 삭제
            cleanup_files()
        else:
            print(f"Processing for worknum {worknum} is not started as response is not '1'")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running test_blur_app.py: {e.stderr}")
        # 작업 상태를 '에러'로 업데이트
        collection.update_one({"worknum": worknum}, {"$set": {"job_ok": -1}})
        print("Processing failed...")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        # 작업 상태를 '에러'로 업데이트
        collection.update_one({"worknum": worknum}, {"$set": {"job_ok": -1}})
        print("Processing failed...")

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

def extract_number(s):
    return int(''.join(filter(str.isdigit, s)))

def find_pending_documents():
    pending_list = []
    documents = collection.find({"job_ok": 0})
    for doc in documents:
        pending_list.append(doc['worknum'])

    # 정렬된 리스트
    pending_sorted_list = sorted(pending_list, key=extract_number)
    return pending_sorted_list

# API Endpoints

# Health Check
@app.get("/")
async def root():
    return {"message": "FastAPI-FACE"}

# 인식할 인물 사진 입력
@app.post("/f-trainfaces")
async def input_train_image(
    directory_name: str = Form(...), 
    files: List[UploadFile] = File(...)
):
    try:
        if len(files) != 5:
            raise HTTPException(status_code=400, detail="Exactly 5 images must be uploaded.")

        UPLOAD_DIR = Path("knn_examples/train") / directory_name
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        for file in files:
            file_location = UPLOAD_DIR / file.filename
            with file_location.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

        print({"info": f"Files saved in directory '{UPLOAD_DIR}'"})
        return JSONResponse(content={"info": "Files are being processed"})
    
    except Exception as e:
        # 그 외의 모든 예외를 처리하여 서버 오류 응답을 반환하고 로그를 기록
        logger.error(f"Error in upload_file: {e}")  # 오류 로그
        raise HTTPException(status_code=500, detail="Upload failed")

# 비디오 파일을 업로드하고 처리 큐에 추가
@app.post("/f-editvideo")
async def input_video(
    file: UploadFile = File(...), 
    filename: str = Form(...),
    worknum: str = Form(...)
):
    try:
        UPLOAD_DIR = Path("knn_examples/test")
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        # 비디오 파일 저장
        file_location = UPLOAD_DIR / file.filename
        with file_location.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # name 정의
        subdir_name = [d.name for d in Path("knn_examples/train").iterdir() if d.is_dir() and d.name.startswith(worknum)]
        name = subdir_name[0][6:] if subdir_name else ""

        # MongoDB 저장
        document = {
            "worknum": worknum,
            "filename": filename,
            "video_file_path": str(file_location),
            "s3_url": "",
            "labels": name,
            "job_ok": 0  # 초기 상태
        }
        collection.insert_one(document)

        # 큐에 비디오 처리 작업 추가
        video_queue.put((file_location, filename, worknum))

        print({"info": f"file '{file.filename}' saved at '{file_location}'"})
        return JSONResponse(content={"info": "Video is being processed"})

    except Exception as e:
        # 그 외의 모든 예외를 처리하여 서버 오류 응답을 반환하고 로그를 기록
        logger.error(f"Error in upload_video: {e}")  # 오류 로그
        raise HTTPException(status_code=500, detail="Upload failed")

# 처리된 비디오의 S3 URL 불러오기
@app.get("/f-downloadvideo")
async def get_download_link(worknum: str):
    try:
        document = find_video_document(worknum)

        if not document:
            raise HTTPException(status_code=404, detail="Job number not found")

        # S3에서 해당 worknum 폴더의 파일 리스트 가져오기
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=f"{worknum}/")
        
        if 'Contents' not in response:
            raise HTTPException(status_code=404, detail="Job number folder not found")
        
        # mp4 파일 찾기
        mp4_files = [content['Key'] for content in response['Contents'] if content['Key'].endswith('.mp4')]
        
        if not mp4_files:
            raise HTTPException(status_code=404, detail="No mp4 files found in the job number folder")

        # 첫 번째 mp4 파일에 대한 사전 서명된 URL 생성 (필요에 따라 변경 가능)
        mp4_file_key = mp4_files[0]
        download_url = s3_client.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': bucket_name, 'Key': mp4_file_key},
            ExpiresIn=3600  # URL 유효 기간: 1시간 (3600초)
        )

        return {
            "download_url": download_url,
            "labels": str(document.get("labels")) 
        }

    except HTTPException as http_exc:
        # HTTPException의 경우 별도로 처리하여 적절한 응답을 반환
        raise http_exc

    except Exception as e:
        # 그 외의 모든 예외를 처리하여 서버 오류 응답을 반환하고 로그를 기록
        logger.error(f"Error in get_download_link: {e}")  # 오류 로그
        raise HTTPException(status_code=500, detail="An unexpected error occurred while processing the request")

# 백그라운드에서 비디오 처리 쓰레드 시작
thread = threading.Thread(target=process_video_from_queue)
thread.daemon = True
thread.start()

@app.get("/f-findlist")
async def get_pending_jobs():
    try:
        pending_jobs = find_pending_documents()
        return JSONResponse(content={"pending_jobs": pending_jobs})
    except Exception as e:
        logger.error(f"Error in get_pending_jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve pending jobs")