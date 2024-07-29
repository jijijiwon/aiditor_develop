import React, { useState } from "react";
import Modal from "react-modal";
import "./PhotoUploadPopup.css"; // CSS 파일을 따로 관리

Modal.setAppElement("#root");

const PhotoUploadPopup = ({ isOpen, closeModal, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = selectedFiles.filter(
      (file) => !files.some((f) => f.name === file.name)
    );
    const totalFiles = files.concat(newFiles);
    if (totalFiles.length <= 5) {
      setFiles(totalFiles);
      setCurrentFileName(selectedFiles[selectedFiles.length - 1].name); // 최신 선택한 파일만 표시
      event.target.value = null; // 선택한 파일 인풋 필드를 초기화
    } else {
      alert("5장의 사진만 선택할 수 있습니다.");
    }
  };

  const handleIndexChange = (event) => {
    setIndex(event.target.value);
  };

  const submitFiles = async () => {
    if (files.length !== 5 || index === "") {
      alert("5장의 사진과 인물의 이름을 입력해주세요.");
      return;
    }

    console.log(files);

    const formData = new FormData();
    files.forEach((file, idx) => {
      formData.append(`photo${idx + 1}`, file);
    });
    formData.append("index", index);

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value.name || value}`);
    // } // log 확인

    onUpload(formData); // 부모 컴포넌트로 데이터를 전달
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Photo Upload Popup"
    >
      <div className="popup-overlay"></div>
      <div className="popup">
        <button className="popup-close" onClick={closeModal}>
          ×
        </button>
        <div className="popup-content">
          <img src="./images/folder.png" alt="Folder" className="folder-icon" />
          <h2>감지할 얼굴이 담긴 사진 5장을 업로드 해주세요.</h2>
          <form id="upload-form" method="post" encType="multipart/form-data">
            <div className="file-upload-wrapper">
              <label htmlFor="photo-files" className="custom-file-upload">
                파일 선택하기
              </label>
              <input
                type="file"
                id="photo-files"
                name="photoFiles"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <input
                type="text"
                id="file-name"
                className="file-name"
                value={currentFileName}
                readOnly
              />
            </div>
            <div className="index-input-wrapper">
              <label htmlFor="index-input" className="index-label">
                인물의 이름을 입력해주세요:
              </label>
              <input
                type="text"
                id="index-input"
                name="index"
                value={index}
                onChange={handleIndexChange}
                className="index-input"
              />
            </div>
            <button type="button" onClick={submitFiles} className="submit-btn">
              저장
            </button>
          </form>
          <div>
            {files.length > 0 && (
              <ul>
                {files.map((file, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: "#E7E7E7",
                      padding: "5px",
                      borderRadius: "5px",
                      marginRight: "5px",
                      marginBottom: "5px",
                      display: "inline-block",
                    }}
                  >
                    {file.name}
                  </span>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PhotoUploadPopup;
