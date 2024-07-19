import React from "react";
import { useNavigate } from "react-router-dom";

function Developing() {
  const navigate = useNavigate();

  const developingStyle = {
    maxWidth: "100%",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "60vh",
    justifyContent: "center",
    FontFace: "Pretendard",
  };

  const buttonStyle = {
    width: "40%",
    backgroundColor: "#100db1",
    color: "#fff",
    border: "none",
    borderRadius: "40px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "backgroundColor 0.3s ease",
    marginTop: "30px",
    padding: "15px",
    FontFamily: "Pretendard",
  };

  const buttonHoverStyle = {
    backgroundColor: "#005bb5",
  };

  return (
    <>
      <h3 style={{ color: "#F80D38" }}>실시간 모자이크</h3>
      <div className="developing" style={developingStyle}>
        <div className="icon" style={{ marginBottom: "40px" }}>
          <img
            src="images/developing.png"
            alt="Developing Icon"
            style={{ height: "200px" }}
          />
        </div>
        <p style={{ textAlign: "center" }}>
          아직 개발 중인 페이지에요!!
          <br />
          멋진 기능으로 채워 놓을거에요. 조금만 기다려 주세요:-)
        </p>
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#005bb5")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#100db1")}
          onClick={() => navigate("/")}
        >
          홈으로 돌아가기
        </button>
      </div>
    </>
  );
}

export default Developing;
