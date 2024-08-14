import "./ModerationRequest.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "react-modal";

function RequestDone(props) {
  const navigate = useNavigate();

  const images = [
    "/images/banner2.png",
    "/images/banner3.png",
    "/images/banner4.png",
    "/images/banner5.png",
  ];

  const [randomIndex, setRandomIndex] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    navigate("/", { replace: true });
  };

  const modalStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
      border: "none",
      background: "none",
    },
  };

  useEffect(() => {
    const index = Math.floor(Math.random() * images.length);
    setRandomIndex(index);
    setIsOpen(true);
  }, []);

  return (
    <>
      <h3 style={{ color: "#F80D38" }}>요청 완료</h3>
      <div className="moderation-done">
        <div className="icon">
          <img src="images/logo.png" alt="Moderation Icon" />
        </div>
        <h2 style={{ color: "#feca57" }}>기다려주세요!</h2>
        <p style={{ marginBottom: "1px" }}>
          편집이 완료되면 이메일을 보낼게요!
        </p>
        <p style={{ color: "lightgray", fontSize: "13px" }}>
          이메일 수신 동의를 하지 않으면 메일을 받을 수 없어요🤐
        </p>
        <button onClick={handleButtonClick}>완료</button>
      </div>
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={modalStyle}>
        <div className="modal-container">
          <header
            className="modal-container-header"
            style={{ padding: "0.5em 2em" }}
          >
            <h3> </h3>
            <h3 style={{ textAlign: "center" }}>광고</h3>
            <button className="icon-button" onClick={closeModal}>
              <img src="images/close.png" alt="Close Icon" />
            </button>
          </header>
          <img src={images[randomIndex]} alt="Random"></img>
        </div>
      </Modal>
    </>
  );
}

export default RequestDone;
