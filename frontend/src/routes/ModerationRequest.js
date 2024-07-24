import React, { useState } from "react";
import axios from "axios";
import "./ModerationRequest.css";
import { useNavigate } from "react-router-dom";
import DropdownInput from "../components/DropdownInput";
import CheckboxList from "../components/CheckboxList";

const power_options = ["약하게", "중간", "강하게"];
const power_opt = ["0.3", "0.5", "0.7"];

const mosaic_options = ["약하게", "중간", "강하게"];
const mosaic_opt = ["60", "30", "15"];

const ModerationRequest = (props) => {
  const [videoFile, setVideoFile] = useState(null);
  const [newVideoName, setNewVideoName] = useState("");
  const [videoLength, setVideoLength] = useState(null);
  const [power, setPower] = useState(power_options[1]);
  const [mosaicStrength, setMosaicStrength] = useState(mosaic_options[1]);
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const type = "M";
  const navigate = useNavigate();

  const items = ["knife", "gun", "middle_finger", "cigarette"];
  const [selectedLabels, setSelectedLabels] = useState(items);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    getVideoLength(file);
    generateThumbnail(file);
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
    if (selectedLabels.length === 0) {
      alert("적어도 하나의 편집 컨텐츠를 선택해주세요.");
      return;
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

    // console.log(formData);

    try {
      // 첫 번째 POST 요청 (JSON 형식)
      const response = await axios.post(
        `${props.baseurl}/video-reqeust`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response.data);
      const worknum = response.data;
      const powerOpt = power_opt[power_options.indexOf(power)];
      const mosaicOpt = mosaic_opt[mosaic_options.indexOf(mosaicStrength)];
      const labels = selectedLabels;

      const newFormData = new FormData();
      newFormData.append("videofile", videofile);
      newFormData.append("filename", filename);
      newFormData.append("worknum", worknum);
      newFormData.append("power", powerOpt);
      newFormData.append("mosaic", mosaicOpt);
      newFormData.append("labels", labels);

      const response2 = await axios.post(
        `${props.baseurl}/mp-video-edit`,
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/RequestDone");
    } catch (error) {
      console.error(error);
      // 일반 오류 처리 (예: 오류 메시지 표시)
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <>
      <h3 style={{ color: "#F80D38", fontFamily: "TossFaceFont" }}>
        🛡 유해정보 블라인드
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
              <h3>유해정보 블라인드 편집 요청</h3>
              <label>
                편집 타입 :
                <input type="text" value="Moderation" readOnly />
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
              <label>
                편집할 컨텐츠:
                <div className="labels-check">
                  <CheckboxList
                    items={items}
                    onSelectionChange={setSelectedLabels}
                  />
                </div>
              </label>
              <label>
                감지 민감도 :
                <DropdownInput
                  options={power_options}
                  defaultValue={power_options[1]} // 디폴트 값 설정
                  onSelect={(option) => setPower(option)}
                />
              </label>
              <label>
                모자이크 강도 :
                <DropdownInput
                  options={mosaic_options}
                  defaultValue={mosaic_options[1]} // 디폴트 값 설정
                  onSelect={(option) => setMosaicStrength(option)}
                />
              </label>
            </div>
          </div>
          <button type="submit" className="submit-btn">
            {isLoading ? (
              <img
                src="images/load.gif"
                alt="loading"
                style={{ height: "15px", margin: "0", padding: "0" }}
              />
            ) : (
              "AIditor, 편집을 시작해줘!"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default ModerationRequest;
