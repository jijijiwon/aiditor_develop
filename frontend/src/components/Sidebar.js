import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Sidebar.css";

function Sidebar(props) {
  const location = useLocation();

  const getTitle = (path) => {
    switch (path) {
      case "/RTModeration":
        return "실시간 유해정보 블라인드";
      case "/RTPrivacy":
        return "실시간 개인정보 보호";
      case "/ModerationRequest":
        return "유해정보 블라인드";
      case "/PrivacyProtectionRequest":
        return "개인정보 보호";
      case "/FaceDetectionRequest":
        return "얼굴 감지";
      case "/RequestDone":
        return "편집 요청 완료";
      case "/login":
        return "AIvolution - 로그인";
      case "/mypage":
        return "AIvolution - My Page";
      case "/infochange":
        return "My Page - 정보 변경";
      case "/ticket":
        return "AIvolution - 이용권 구매";
      case "/editdone":
        return "편집 결과 확인";
      case "/editing":
        return "편집 결과 확인";
      case "/editerror":
        return "편집 결과 확인";
      case "/board":
        return "AIvolution - 게시판";
      case "/boardwrite":
        return "AIvolution - 게시판";
      case "/announce":
        return "AIvolution - 공지사항";
      case "/annc":
        return "AIvolution - 공지사항 상세";
      case "/kakao-login/auth":
        return "카카오 로그인";
      default:
        return "AIvolution";
    }
  };

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
      <Helmet>
        <title>{getTitle(location.pathname)}</title>
      </Helmet>
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
              <Link to="/RTModeration">유해정보 블라인드</Link>
            </li>
            <li>
              <Link to="/RTPrivacy">개인정보 보호</Link>
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
