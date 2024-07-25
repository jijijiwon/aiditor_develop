from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from ultralytics import YOLO
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 시크릿 제이슨 파일에서 환경 변수를 로드
with open('../config/secrets.json') as f:
    secrets = json.load(f)

FAST_API_RT_IP_PORT = secrets['FAST_API_RT_IP_PORT']
FAST_API_RT_IP = secrets['FAST_API_RT_IP']
FRONT_IP = secrets['FRONT_IP']

# CORS 설정
origins = [
    "https://www.aivolution.link",  # React 앱이 실행되는 도메인
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 도메인 목록
    allow_credentials=True,
    allow_methods=["*"],  # 허용할 HTTP 메서드
    allow_headers=["*"],  # 허용할 HTTP 헤더
)

# YOLO 모델 로드
model_M = YOLO("yolomodel/addf2.pt")
model_P = YOLO("yolomodel/card2.pt")

@app.get("/")
async def root():
    return {"message": "FastAPI-realtime"}

@app.post("/realtime-m")
async def detect_objects(file: UploadFile = File(...)):
    # 업로드된 파일을 읽음
    image_data = await file.read()
    # 이미지 데이터를 numpy 배열로 변환
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 객체 감지 수행
    results = model_M(image)

    # YOLOv8 결과 처리
    detections = []
    for result in results:
        # results는 이미지 리스트, 각각의 result는 감지 결과
        for box in result.boxes:
            # box.xyxy는 좌표, box.conf는 신뢰도, box.cls는 클래스 인덱스
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = box.conf[0].item()
            class_id = int(box.cls[0].item())
            detections.append({
                "box": [int(x1), int(y1), int(x2), int(y2)],
                "confidence": confidence,
                "class": model_M.names[class_id]  # class names는 모델에 저장되어 있음
            })
    
    print(detections)
    return JSONResponse(content={"detections": detections})


@app.post("/realtime-p")
async def detect_objects(file: UploadFile = File(...)):
    # 업로드된 파일을 읽음
    image_data = await file.read()
    # 이미지 데이터를 numpy 배열로 변환
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 객체 감지 수행
    results = model_M(image)

    # YOLOv8 결과 처리
    detections = []
    for result in results:
        # results는 이미지 리스트, 각각의 result는 감지 결과
        for box in result.boxes:
            # box.xyxy는 좌표, box.conf는 신뢰도, box.cls는 클래스 인덱스
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = box.conf[0].item()
            class_id = int(box.cls[0].item())
            detections.append({
                "box": [int(x1), int(y1), int(x2), int(y2)],
                "confidence": confidence,
                "class": model_P.names[class_id]  # class names는 모델에 저장되어 있음
            })
    
    print(detections)
    return JSONResponse(content={"detections": detections})

    
# 서버 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=FAST_API_RT_IP, port=FAST_API_RT_IP_PORT)
