import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-modal";
import PhotoUploadPopup from "../components/PhotoUploadPopup";

const FaceDetectionRequest = (props) => {
  const [videoFile, setVideoFile] = useState(null);
  const [newVideoName, setNewVideoName] = useState("");
  const [videoLength, setVideoLength] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [uploadedPhotos, setUploadedPhotos] = useState(null);
  const [index, setIndex] = useState(""); // 추가: 인덱스 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const [isTicketOK, setIsTicketOK] = useState(true);

  const type = "F";
  const navigate = useNavigate();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  async function selectticket() {
    const isLogin = Number(props.isLogin) || 0; // props.isLogin을 숫자로 변환, 기본값 0
    if (isLogin !== 1) {
      props.setTicket([0, 0, 0]);
    } else {
      try {
        // console.log("email: ", props.email);
        const email = props.email;
        const response = await axios.get(props.baseurl + "/selectticket", {
          params: { email: email },
        });
        // console.log(response.data);

        const ticketData = [
          response.data["totalticket"],
          response.data["usedticket"],
          response.data["remainticket"],
        ];

        props.setTicket(ticketData);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  }

  function convertTime(ticketSeconds) {
    const hours = Math.floor(ticketSeconds / 3600);
    const minutes = Math.floor((ticketSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (ticketSeconds % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  const handleNotuserClick = (event) => {
    const isLogin = Number(props.isLogin) || 0; // props.isLogin을 숫자로 변환, 기본값 0
    if (isLogin !== 1) {
      event.preventDefault();
      alert("로그인이 필요한 서비스입니다🐱");
      navigate("/login");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    getVideoLength(file);
    generateThumbnail(file);
    selectticket();
  };

  const handleNameChange = (event) => {
    setNewVideoName(event.target.value);
  };

  const sanitizeFileName = (name) => {
    // 허용되지 않는 문자들을 '_'로 대체
    const sanitized = name
      .replace(/[<>:"\/\\|?*\x00-\x1F]/g, "_")
      .replace(/\s+/g, "_") // 모든 공백 문자를 '_'로 대체
      .replace(/_+/g, "_"); // 연속된 '_'를 하나로 합침

    // 예약된 이름인지 확인 (Windows 기준)
    const reservedNames = [
      "CON",
      "PRN",
      "AUX",
      "NUL",
      "COM1",
      "COM2",
      "COM3",
      "COM4",
      "COM5",
      "COM6",
      "COM7",
      "COM8",
      "COM9",
      "LPT1",
      "LPT2",
      "LPT3",
      "LPT4",
      "LPT5",
      "LPT6",
      "LPT7",
      "LPT8",
      "LPT9",
    ];

    let finalName = sanitized;
    if (reservedNames.includes(sanitized.toUpperCase())) {
      finalName = `_${sanitized}`;
    }

    // 파일 이름 길이 제한 (255 characters)
    if (finalName.length > 255) {
      finalName = finalName.substring(0, 255);
    }

    // 확장자를 추가하는 부분은 기존 코드에서 처리
    if (!finalName.endsWith(".mp4")) {
      finalName += ".mp4";
    }

    return finalName;
  };

  const handleNameBlur = () => {
    if (newVideoName) {
      const formattedName = sanitizeFileName(newVideoName);
      setNewVideoName(formattedName);
    }
  };

  const getVideoLength = (file) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      setVideoLength(video.duration);
      if (video.duration > props.ticket[2]) {
        setIsTicketOK(false);
      }
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 엔터 키 눌렀을 때 기본 동작 방지
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uploadedPhotos) {
      // console.log(uploadedPhotos);
      alert("사진을 먼저 선택해주세요.");
      return;
    }

    if (props.ticket[2] - parseInt(videoLength) < 0) {
      alert("먼저 이용권을 구매해주세요!");
      return;
    } else {
      let newusedticket = (
        parseInt(props.ticket[1]) + parseInt(videoLength)
      ).toString();
      let newremainticket = (
        parseInt(props.ticket[2]) - parseInt(videoLength)
      ).toString();
      props.setTicket([props.ticket[0], newusedticket, newremainticket]);

      try {
        const response = await axios.put(
          `${props.baseurl}/updateusedticket`,
          {
            email: props.email,
            usedticket: newusedticket,
            remainticket: newremainticket,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    setIsLoading(true); // 로딩 상태 시작

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
      // console.log(worknum);

      // 인덱스 수정
      const modifiedIndex = worknum + index;
      // console.log(modifiedIndex);

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

      // console.log(photoResponse.data);

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
    } finally {
      setIsLoading(false); // 로딩 상태 종료
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
                  "클릭하여 PC의 동영상을 선택해주세요💾"
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                />
              </label>
              {videoLength && (
                <div style={{ textAlign: "center" }}>
                  <p>
                    선택한 영상의 길이: {Math.floor(videoLength / 60)}:
                    {Math.floor(videoLength % 60)
                      .toString()
                      .padStart(2, "0")}{" "}
                  </p>
                  {isTicketOK ? (
                    <p>사용 가능한 이용권: {convertTime(props.ticket[2])}</p>
                  ) : (
                    <p style={{ color: "#F80D38" }}>
                      사용 가능한 이용권: {convertTime(props.ticket[2])}
                      <Link to="/ticket" onClick={handleNotuserClick}>
                        <img
                          src="/images/external.png"
                          className="ticket-link"
                          alt="구매하기"
                        />
                        <span className="ticket-linktext">구매하기</span>
                      </Link>
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="input-box">
              <h3>얼굴 감지 편집 요청</h3>
              <label>
                편집 타입 :
                <input type="text" value="얼굴 감지" readOnly />
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
                  onKeyDown={handleKeyDown}
                  required
                />
              </label>
            </div>
          </div>
          {isLoading ? (
            <button type="button" className="submit-btn">
              <img
                src="images/load.gif"
                alt="loading"
                style={{ height: "15px", margin: "0", padding: "0" }}
              />
            </button>
          ) : (
            <button type="submit" className="submit-btn">
              AIditor, 편집을 시작해줘!
            </button>
          )}
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
