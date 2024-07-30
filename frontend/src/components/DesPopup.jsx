import React, { useState } from "react";
import Modal from "react-modal";
import "./PhotoUploadPopup.css"; // CSS 파일을 따로 관리

Modal.setAppElement("#root");

const DesPopup = ({ isOpen, closeModal, onUpload }) => {
  const files = ["gildong.png", "hong.png", "gildong2.png"];

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
            <div className="tooltip">
              <div className="link-keyword">
                <div className="file-upload-wrapper">
                  <label htmlFor="photo-files" className="custom-file-upload">
                    파일 선택하기
                  </label>
                  <div id="photo-files" />
                  <input
                    type="text"
                    id="file-name"
                    className="file-name"
                    value="gildong2.png"
                    readOnly
                  />
                </div>
              </div>
              <div className="linktext" style={{ left: "30%", top: "30px" }}>
                버튼을 클릭하여 5장의 사진을 선택할 수 있습니다. 더 적거나 많게
                선택하면 요청을 저장할 수 없습니다.
              </div>
            </div>
            <div className="tooltip">
              <div className="link-keyword">
                <div className="index-input-wrapper">
                  <label htmlFor="index-input" className="index-label">
                    인물의 이름을 입력해주세요:
                  </label>
                  <input
                    type="text"
                    id="index-input"
                    value="홍길동"
                    className="index-input"
                    readOnly
                  />
                </div>
              </div>
              <div className="linktext" style={{ left: "30%", top: "30px" }}>
                위에서 선택한 인물의 이름을 입력해주세요.
              </div>
            </div>
            <button type="button" className="submit-btn" onClick={closeModal}>
              저장
            </button>
          </form>
          <div className="tooltip">
            <div className="link-keyword">
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
                    {file}
                  </span>
                ))}
              </ul>
            </div>
            <div className="linktext" style={{ left: "30%", top: "30px" }}>
              선택된 파일을 표시합니다.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DesPopup;
