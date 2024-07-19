import "./ModerationRequest.css";
import { useNavigate } from "react-router-dom";

function RequestDone(props) {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/", { replace: true });
  };
  return (
    <>
      <h3 style={{ color: "#F80D38" }}>유해정보 블라인드</h3>
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
    </>
  );
}

export default RequestDone;
