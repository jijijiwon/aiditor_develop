##0716 main.py

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

# secret.json 파일에서 환경 변수를 로드
with open('secrets.json') as f:
    secrets = json.load(f)

# MongoDB 설정
MONGODB_ID_F = secrets["MONGODB_ID_F"]
MONGODB_PASSWORD_F = secrets["MONGODB_PASSWORD_F"]
MONGODB_PORT_F = secrets["MONGODB_PORT_F"]

# AWS S3 설정
S3_ACCESS_KEY_ID_F = secrets["S3_ACCESS_KEY_ID_F"]
S3_SECRET_ACCESS_KEY_F = secrets["S3_SECRET_ACCESS_KEY_F"]
S3_BUCKET_NAME_F = secrets["S3_BUCKET_NAME_F"]
S3_REGION_F = secrets["S3_REGION_F"]

app = FastAPI()

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

def find_video_document(worknum):
    return collection.find_one({"worknum": worknum})

@app.get("/")
async def root():
    return {"message": "FastAPI-FACE"}

@app.post("/f-trainfaces")
async def input_train_image(
    directory_name: str = Form(...), 
    files: List[UploadFile] = File(...)
):
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

@app.post("/f-editvideo")
async def input_video(
    file: UploadFile = File(...), 
    filename: str = Form(...),
    worknum: str = Form(...)):
    UPLOAD_DIR = Path("knn_examples/test")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    # 비디오 파일 저장
    file_location = UPLOAD_DIR / file.filename
    with file_location.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # name 정의
    subdir_name = [d.name for d in Path("knn_examples/train").iterdir() if d.is_dir() and d.name.startswith(worknum)]
    name = subdir_name[0][6:] if subdir_name else ""

    # mongodb 저장
    document = {
        "worknum": worknum,
        "filename": filename,
        "video_file_path": str(file_location),
        "s3_url": "",
        "labels": name
    }
    collection.insert_one(document)

    # test_blur_app.py 실행
    try:
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

    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running test_blur_app.py: {e.stderr}")

    print({"info": f"file '{file.filename}' saved at '{file_location}'"})
    return JSONResponse(content={"info": "Video is being processed"})

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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))