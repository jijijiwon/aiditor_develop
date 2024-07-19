import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar(props) {
  const handleLogout = () => {
    console.log("User signed out.");
    props.setName("");
    props.setEmail("");
    props.setPicture("");
    props.setIsAdmin(0);
    props.setIsLogin(0);
  };

  const navigate = useNavigate();
  const handleNotuserClick = () => {
    console.log("handleNotuserClick: ", props.isLogin);
    if (!props.isLogin) {
      alert("로그인이 필요한 서비스입니다🐱");
      navigate("/login");
    } else {
      navigate("/mypage");
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/">
          <img src="/images/mainlogo.png" alt="icon" className="main-logo" />
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/developing" style={{ color: "#100db1" }}>
            <img src="/images/realtime.png" alt="icon" className="menu-icon" />
            실시간 모자이크
          </Link>
          <ul className="submenu">
            <li>
              {/* <Link to="/RTModeration">유해정보 블라인드</Link> */}
              <Link to="/developing">유해정보 블라인드</Link>
            </li>
            <li>
              <Link to="/developing">개인정보 보호</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/ModerationRequest" style={{ color: "#100db1" }}>
            <img
              src="/images/video-editor.png"
              alt="icon"
              className="menu-icon"
              onClick={handleNotuserClick}
            />
            영상 편집기
          </Link>
          <ul className="submenu">
            <li>
              <Link to="/ModerationRequest">유해정보 블라인드</Link>
            </li>
            <li>
              <Link to="/PrivacyProtectionRequest">개인정보 보호</Link>
            </li>
            <li>
              <Link to="/FaceDetectionRequest">얼굴 감지</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/Board" style={{ color: "#100db1" }}>
            <img
              src="/images/board.png"
              alt="icon"
              className="menu-icon"
              onClick={handleNotuserClick}
            />
            게시판
          </Link>
        </li>
      </ul>
      <div className="account">
        <h3>사용자 계정</h3>
        <ul>
          <li>
            <div className="mypage" onClick={handleNotuserClick}>
              <img src="/images/user.png" alt="icon" className="menu-icon" />
              My Page
            </div>
          </li>
          <li>
            <Link to="/" onClick={handleLogout} style={{ color: "red" }}>
              <img src="/images/logout.png" alt="icon" className="menu-icon" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
      <div className="developer">
        <p style={{ textAlign: "center" }}>Developer:</p>
        <p>+ljiwon0310@gmail.com</p>
        <p>+apo1803058@gmail.com</p>
        <p>+9005253@gmail.com</p>
        <p>+juyeon0310@naver.com</p>
      </div>
    </div>
  );
}

export default Sidebar;
