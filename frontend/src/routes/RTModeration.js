import { useState, useEffect, useRef } from "react";
import React from "react";
import axios from "axios";
import "./RTModeration.css";

// 환경 변수에서 API URL 가져오기
const apiUrl = process.env.REACT_APP_RT_URL;

function RTModeration() {
  // 비디오 및 캔버스 요소에 대한 참조 생성
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 상태 변수 생성
  const [detections, setDetections] = useState([]);
  const [videoSize, setVideoSize] = useState({ width: 960, height: 540 });
  const [isMirrored, setIsMirrored] = useState(false); // 반전 여부 관리

  useEffect(() => {
    // 웹캠 스트림 설정 함수
    const getUserMedia = async () => {
      try {
        // 웹캠 비디오 스트림 요청
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 960 }, // 이상적인 너비 설정
            height: { ideal: 540 }, // 이상적인 높이 설정
          },
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
    const intervalId = setInterval(captureAndUpload, 500); // 0.5초 간격
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, []);

  const captureAndUpload = async () => {
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
      formData.append("file", blob, "webcam.jpg");

      try {
        // 서버로 이미지 업로드 요청
        const response = await axios.post(`${apiUrl}/realtime-m`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // 감지된 객체 정보를 상태로 저장
        setDetections(response.data.detections);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }, "image/jpeg");
  };

  // 반전 토글 함수
  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  const labels = [
    { label: "knife", kor: "칼🔪", color: "#100DB1" },
    { label: "gun", kor: "총🔫", color: "#763CEF" },
    { label: "middle_finger", kor: "손가락 욕🖕", color: "#FECA57" },
    { label: "cigarette", kor: "담배🚬", color: "#F80D38" },
  ];

  return (
    <>
      <h3 style={{ color: "#F80D38", fontFamily: "TossFaceFont" }}>
        🛡 실시간 유해 정보 블라인드
      </h3>
      <div className="rt-moderation">
        <div className="label-list">
          <h5>유의사항</h5>
          <p style={{ marginTop: "2px" }}>웹캠 허용 필수!📸</p>
          <h5>감지하는 컨텐츠</h5>
          {labels.map((menu, i) => (
            <div id="label-list" key={i}>
              <div className="title">
                <li style={{ color: labels[i].color }}>
                  <p style={{ display: "inline", color: "black" }}>
                    {labels[i].kor}
                  </p>
                </li>
              </div>
            </div>
          ))}
          <h5 style={{ marginTop: "10px" }}>
            화면 방향 설정
            <button
              onClick={toggleMirror}
              className={isMirrored ? "active-button" : ""}
              style={{ marginBottom: "10px" }}
            >
              {isMirrored ? "좌우 반전중" : "원본"}
            </button>
          </h5>
        </div>
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="video-element"
            style={{
              width: videoSize.width,
              height: videoSize.height,
              transform: isMirrored ? "scaleX(-1)" : "scaleX(1)", // 비디오 요소를 좌우 반전
            }}
          />
          <canvas ref={canvasRef} className="canvas-element"></canvas>
          {/* 감지된 객체 정보를 화면에 표시 */}
          {detections.map((detection, index) => (
            <div
              key={index}
              className="detection-box"
              style={{
                left: isMirrored
                  ? `${
                      videoSize.width -
                      (detection.box[2] - detection.box[0]) -
                      detection.box[0]
                    }px`
                  : `${detection.box[0]}px`,
                top: `${detection.box[1]}px`,
                width: `${detection.box[2] - detection.box[0]}px`,
                height: `${detection.box[3] - detection.box[1]}px`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RTModeration;
