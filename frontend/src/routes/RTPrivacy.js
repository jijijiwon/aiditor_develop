import { useState, useEffect, useRef } from "react";
import React from "react";
import axios from "axios";
import "./RTModeration.css";

// 환경 변수에서 API URL 가져오기
const apiUrl = process.env.REACT_APP_RT_URL;

function RTPrivacy() {
  // 비디오 및 캔버스 요소에 대한 참조 생성
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // 감지된 객체 정보를 저장하는 상태 변수
  const [detections, setDetections] = useState([]);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });

  useEffect(() => {
    // 웹캠 스트림 설정 함수
    const getUserMedia = async () => {
      try {
        // 웹캠 비디오 스트림 요청
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          // 비디오 요소에 스트림 설정
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
    getUserMedia();

    // 주기적으로 이미지 캡처 및 업로드
    const intervalId = setInterval(captureAndUpload, 1000); // 1초 간격
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, []);

  const captureAndUpload = async () => {
    // 캔버스의 2D 컨텍스트 가져오기
    if (!canvasRef.current || !videoRef.current) return;
    const context = canvasRef.current.getContext("2d");

    // 비디오 요소의 크기를 동적으로 설정
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    if (videoWidth && videoHeight) {
      setVideoSize({ width: videoWidth, height: videoHeight });
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    }

    // 비디오에서 캔버스로 이미지 그리기
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // 캔버스를 Blob 형식으로 변환
    canvasRef.current.toBlob(async (blob) => {
      const formData = new FormData();
      // FormData에 Blob 추가
      formData.append("file", blob, "webcam.jpg");

      try {
        // 서버로 이미지 업로드 요청
        const response = await axios.post(`${apiUrl}/realtime-p`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data.detections); // 감지된 객체 출력
        setDetections(response.data.detections);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }, "image/jpeg");
  };

  return (
    <div className="rt">
      <h1>WebCam Object Detection</h1>
      <div
        className="video-container"
        style={{ width: videoSize.width, height: videoSize.height }}
      >
        <video ref={videoRef} autoPlay playsInline className="video-element" />
        <canvas ref={canvasRef} className="canvas-element"></canvas>
        {/* 감지된 객체 정보를 화면에 표시 */}
        {detections.map((detection, index) => (
          <div
            key={index}
            className="detection-box"
            style={{
              left: `${detection.box[0]}px`,
              top: `${detection.box[1]}px`,
              width: `${detection.box[2] - detection.box[0]}px`,
              height: `${detection.box[3] - detection.box[1]}px`,
            }}
          >
            {detection.class}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RTPrivacy;
