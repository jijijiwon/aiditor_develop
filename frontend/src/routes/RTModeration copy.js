import { useState, useEffect, useRef } from "react";
import React from "react";
import axios from "axios";
import "./RTModeration.css";

const apiUrl = process.env.REACT_APP_RT_URL;

function RTModeration() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
    getUserMedia();

    const intervalId = setInterval(captureAndUpload, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const captureAndUpload = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const context = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });

    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    if (videoWidth && videoHeight) {
      setVideoSize({ width: videoWidth, height: videoHeight });
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    }

    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    canvasRef.current.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "webcam.jpg");

      try {
        const response = await axios.post(`${apiUrl}/realtime-m`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const detections = response.data.detections;
        setDetections(detections);

        detections.forEach((detection) => {
          const [x, y, xEnd, yEnd] = detection.box;
          const width = xEnd - x;
          const height = yEnd - y;
          const blockSize = 10;

          const imageData = context.getImageData(x, y, width, height);
          for (let row = 0; row < height; row += blockSize) {
            for (let col = 0; col < width; col += blockSize) {
              let red = 0,
                green = 0,
                blue = 0,
                pixelCount = 0;
              for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                  const px = col + dx;
                  const py = row + dy;
                  if (px < width && py < height) {
                    const index = (py * width + px) * 4;
                    red += imageData.data[index];
                    green += imageData.data[index + 1];
                    blue += imageData.data[index + 2];
                    pixelCount++;
                  }
                }
              }
              red = Math.floor(red / pixelCount);
              green = Math.floor(green / pixelCount);
              blue = Math.floor(blue / pixelCount);

              for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                  const px = col + dx;
                  const py = row + dy;
                  if (px < width && py < height) {
                    const index = (py * width + px) * 4;
                    imageData.data[index] = red;
                    imageData.data[index + 1] = green;
                    imageData.data[index + 2] = blue;
                  }
                }
              }
            }
          }

          context.putImageData(imageData, x, y);
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }, "image/jpeg");
  };

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
          {/* 감지되는 콘텐츠 라벨 표시 */}
        </div>
        <div
          className="video-container"
          style={{ width: videoSize.width, height: videoSize.height }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="video-element"
          />
          <canvas ref={canvasRef} className="canvas-element"></canvas>
        </div>
      </div>
    </>
  );
}

export default RTModeration;
