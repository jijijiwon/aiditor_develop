import DropdownInput from "../components/DropdownInput";
import CheckboxList from "../components/CheckboxList";
import { useState, React } from "react";
import DesPopup from "../components/DesPopup";

function DesF(props) {
  const [newVideoName, setNewVideoName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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

  return (
    <div className="des-image" id="rt-moderation">
      <div
        className="moderation"
        style={{
          width: "90%",
          border: "solid 1px #d3d3d3",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <div className="input-info">
          <div style={{ width: "40%" }}>
            <label className="videoFile">
              <div className="tooltip">
                <img
                  src="/images/sample_f.gif"
                  alt="sample"
                  className="link-keyword"
                  id="sample-video"
                />
                <div className="linktext">
                  이 박스를 클릭하여 편집을 원하는 영상을 선택할 수 있습니다.
                </div>
              </div>
            </label>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="tooltip">
                <p className="link-keyword">선택한 영상의 길이: 01:10</p>
                <div className="linktext" style={{ left: "75%" }}>
                  선택한 영상의 길이가 표시됩니다. 이 길이에 따라 사용권이
                  차감됩니다.
                </div>
              </div>
              <div className="tooltip">
                <p
                  className="link-keyword"
                  style={{ margin: "3px", padding: "0px" }}
                >
                  사용 가능한 이용권: 10:00
                  <img
                    src="/images/external.png"
                    className="ticket-link"
                    alt="구매하기"
                  />
                  <span className="ticket-linktext">구매하기</span>
                  <div
                    className="linktext"
                    style={{ left: "65%", top: "30px", width: "60%" }}
                  >
                    사용 가능한 이용원 시간이 표시 됩니다. 빨간 글씨로 표시될
                    경우, 이용권이 부족하여 영상 편집을 요청할 수 없습니다.
                    오른쪽 버튼을 사용하여 이용권 구매 페이지로 갈 수 있습니다.
                  </div>
                </p>
              </div>
            </div>
          </div>
          <div className="input-box">
            <h3>얼굴 감지 편집 요청</h3>
            <div className="tooltip">
              <label className="link-keyword">
                편집 타입 :
                <input type="text" value="얼굴 감지" readOnly />
              </label>
              <div className="linktext" style={{ left: "60%" }}>
                메뉴에 따라 자동으로 입력됩니다. <br />
                사용자가 직접 변경할 수 없습니다.
              </div>
            </div>
            <div className="tooltip">
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
              <div className="linktext" style={{ left: "50%", width: "80%" }}>
                클릭하여 감지하고자 하는 얼굴을 입력할 수 있습니다. <br />
                편집 요청을 보내기 전, 먼저 입력해야 합니다.
                <br />
                <span style={{ fontWeight: "bold", color: "#100db1" }}>
                  클릭
                </span>
                하여 화면을 확인하세요.
              </div>
            </div>
            <div className="tooltip">
              <label className="link-keyword">
                저장할 비디오 이름 :
                <input
                  type="text"
                  value={newVideoName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  required
                />
              </label>
              <div className="linktext" style={{ left: "60%", width: "60%" }}>
                저장할 비디오 이름을 정할 수 있습니다. <br />
                'mp4' 파일 유형이 자동 적용되며, 특수문자, 띄어쓰기 등은 사용할
                수 없어 자동으로 대체됩니다.
              </div>
            </div>
          </div>
        </div>
        <div className="tooltip">
          <div
            className="link-keyword"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button type="submit" className="submit-btn">
              아이크, 편집을 시작해줘!
            </button>
          </div>
          <div className="linktext" style={{ left: "70%" }}>
            버튼을 클릭하면 편집 요청이 전송됩니다.
          </div>
        </div>
      </div>
      <DesPopup isOpen={isOpen} closeModal={closeModal} />
    </div>
  );
}

export default DesF;
