import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import PhotoUploadPopup from "../components/PhotoUploadPopup";

const FaceDetectionRequest = (props) => {
  const [videoFile, setVideoFile] = useState(null);
  const [newVideoName, setNewVideoName] = useState("");
  const [videoLength, setVideoLength] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState(null);
  const [index, setIndex] = useState(""); // 추가: 인덱스 상태 관리
  const [isOpen, setIsOpen] = useState(false);

  const type = "F";
  const navigate = useNavigate();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    getVideoLength(file);
    generateThumbnail(file);
  };

  const handleNameChange = (event) => {
    setNewVideoName(event.target.value);
  };

  const handleNameBlur = () => {
    if (newVideoName && !newVideoName.endsWith(".mp4")) {
      setNewVideoName(newVideoName + ".mp4");
    }
  };

  const getVideoLength = (file) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      setVideoLength(video.duration);
    };

    video.src = URL.createObjectURL(file);
  };

  const generateThumbnail = (file) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      video.currentTime = 0; // 첫 프레임으로 이동
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL("image/png"));
      window.URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uploadedPhotos) {
      console.log(uploadedPhotos);

      // for (let [key, value] of uploadedPhotos.entries()) {
      //   console.log(`${key}: ${value.name || value}`);
      // } // log 확인
      alert("사진을 먼저 선택해주세요.");
      return;
    }

    const email = props.email;
    const name = props.name;
    const opt = props.opt;
    const filename = newVideoName;
    const wtype = type;
    const videolength = videoLength;
    const videofile = videoFile;
    const formData = {
      email,
      name,
      opt,
      filename,
      wtype,
      videolength,
    };

    try {
      // 영상 요청 처리
      const response = await axios.post(
        `${props.baseurl}/video-reqeust`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const worknum = response.data;
      console.log(worknum);

      // 인덱스 수정
      const modifiedIndex = worknum + index;
      console.log(modifiedIndex);

      // 얼굴 사진 전송
      const photoFormData = new FormData();
      uploadedPhotos.forEach((file, idx) => {
        photoFormData.append("photo", file);
      });
      photoFormData.append("index", modifiedIndex);

      const photoResponse = await axios.post(
        `${props.baseurl}/request-photos`,
        photoFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(photoResponse.data);

      const newFormData = new FormData();
      newFormData.append("videofile", videofile);
      newFormData.append("filename", filename);
      newFormData.append("worknum", worknum);

      const response2 = await axios.post(
        `${props.baseurl}/f-video-edit`,
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 600000,
        }
      );

      const { jobId } = response.data;
      navigate("/RequestDone");
    } catch (error) {
      console.error(error);
      // 일반 오류 처리 (예: 오류 메시지 표시)
    }
  };

  const handlePhotoUpload = (photoData) => {
    setUploadedPhotos(photoData);
    const indexValue = photoData.get("index"); // 추가: 인덱스 값 설정
    setIndex(indexValue);
  };

  return (
    <>
      <h3 style={{ color: "#F80D38", fontFamily: "TossFaceFont" }}>
        🧒 얼굴 감지
      </h3>
      <div className="moderation">
        <form onSubmit={handleSubmit}>
          <div className="input-info">
            <div style={{ width: "40%" }}>
              <label className="videoFile">
                {videoFile ? (
                  <>
                    <span>{videoFile.name}</span>
                    {thumbnail && <img src={thumbnail} alt="Video Thumbnail" />}
                  </>
                ) : (
                  "Upload video in your PC"
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                />
              </label>
              {videoLength && (
                <p>
                  선택한 영상의 길이: {Math.floor(videoLength / 60)}:
                  {Math.floor(videoLength % 60)
                    .toString()
                    .padStart(2, "0")}{" "}
                  분
                </p>
              )}
            </div>
            <div className="input-box">
              <h3>얼굴 감지 편집 요청</h3>
              <label>
                편집 타입 :
                <input type="text" value="Face Detection" readOnly />
              </label>
              <label>
                감지할 얼굴 입력 :
                <button
                  onClick={openModal}
                  style={{ cursor: "pointer" }}
                  type="button"
                  className="face-index"
                >
                  얼굴 감지를 위한 사진 선택하기
                </button>
              </label>
              <label>
                저장할 비디오 이름 :
                <input
                  type="text"
                  value={newVideoName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  required
                />
              </label>
            </div>
          </div>
          <button type="submit" className="submit-btn">
            AIditor, 편집을 시작해줘!
          </button>
        </form>
      </div>
      <PhotoUploadPopup
        isOpen={isOpen}
        closeModal={closeModal}
        onUpload={handlePhotoUpload}
      />
    </>
  );
};

export default FaceDetectionRequest;
