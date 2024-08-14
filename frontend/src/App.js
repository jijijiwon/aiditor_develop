import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./routes/Main";
import RealtimeDescription from "./routes/RealtimeDescription";
import RTModeration from "./routes/RTModeration";
import RTPrivacy from "./routes/RTPrivacy";
import VideoEditorDecsription from "./routes/VideoEditorDescription";
import ModerationRequest from "./routes/ModerationRequest";
import RequestDone from "./routes/RequestDone";
import PrivacyProtectionRequest from "./routes/PrivacyProtectionRequest";
import FaceDetectionRequest from "./routes/FaceDetectionRequest";
import Login from "./routes/Login";
import MyPage from "./routes/MyPage";
import InfoChange from "./routes/InfoChange";
import Ticket from "./routes/Ticket";
import EditDone from "./routes/EditDone";
import Editing from "./routes/Editing";
import EditError from "./routes/EditError";
import Board from "./routes/Board";
import BoardWrite from "./routes/BoardWrite";
import BoardSelected from "./routes/BoardSelected";
import Announce from "./routes/Announce";
import AnnounceSelected from "./routes/AnnounceSelected";
import Developing from "./routes/Developing";
import KakaoRedirect from "./routes/KakaoRedirect";

const baseurl = process.env.REACT_APP_BACK_URL;
function App() {
  const navigate = useNavigate();
  const secretKey = process.env.REACT_APP_CRYPTO_SECRET_KEY;
  const ENCRYPTION_PREFIX = process.env.REACT_APP_CRYPTO_PREFIX;

  const [visible, setVisible] = useState(true);

  const handleToggle = () => {
    setVisible(!visible);
  };

  // 암호화
  const encrypt = (data) => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secretKey
    ).toString();
    return ENCRYPTION_PREFIX + encrypted;
  };

  // 복호화
  const decrypt = (encryptedData) => {
    if (!encryptedData.startsWith(ENCRYPTION_PREFIX)) {
      console.warn("Data is not in the expected encrypted format");
      return null;
    }

    const realEncryptedData = encryptedData.slice(ENCRYPTION_PREFIX.length);

    try {
      const bytes = CryptoJS.AES.decrypt(realEncryptedData, secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // sessionStorage에서 암호화된 데이터를 가져와 복호화하는 함수
  const getDecryptedSessionItem = (key) => {
    const data = window.sessionStorage.getItem(key);
    if (!data) return null;

    const decryptedData = decrypt(data);
    if (decryptedData === null) {
      alert("비정상적인 접근이 감지되었습니다. 로그아웃 됩니다.");
      window.sessionStorage.clear();
      navigate("/", { replace: true });
      window.location.reload();
      return null;
    } else {
      return decryptedData;
    }

    // 데이터가 암호화된 형식인지 확인
  };

  const [email, setEmail] = useState(getDecryptedSessionItem("email") || "");
  const [name, setName] = useState(getDecryptedSessionItem("name") || "");
  const [picture, setPicture] = useState(
    getDecryptedSessionItem("picture") || ""
  );
  const [isLogin, setIsLogin] = useState(
    getDecryptedSessionItem("isLogin") || 0
  );
  const [opt, setOpt] = useState(getDecryptedSessionItem("opt") || "");
  const [isAdmin, setIsAdmin] = useState(
    getDecryptedSessionItem("isAdmin") || 0
  );
  const [ticket, setTicket] = useState(["0", "0", "0"]);

  useEffect(() => {
    window.sessionStorage.setItem("email", encrypt(email));
    window.sessionStorage.setItem("name", encrypt(name));
    window.sessionStorage.setItem("picture", encrypt(picture));
    window.sessionStorage.setItem("isLogin", encrypt(isLogin));
    window.sessionStorage.setItem("opt", encrypt(opt));
    window.sessionStorage.setItem("isAdmin", encrypt(isAdmin));
  }, [email, name, picture, isLogin, opt, isAdmin]);

  const longbanners = [
    { image: "./images/trippass.png", url: "https://www.trippass.link" },
    { image: "./images/pdfast.png", url: "https://www.aivolution.link" },
    { image: "./images/soriba.png", url: "https://www.soribwa.com" },
    { image: "./images/seesaw.png", url: "https://www.aivolution.link" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % longbanners.length);
    }, 7000); // 7초마다 이미지 변경
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="App">
        <Sidebar
          baseurl={baseurl}
          email={email}
          name={name}
          picture={picture}
          isLogin={isLogin}
          opt={opt}
          isAdmin={isAdmin}
          ticket={ticket}
          setEmail={setEmail}
          setName={setName}
          setPicture={setPicture}
          setIsLogin={setIsLogin}
          setOpt={setOpt}
          setIsAdmin={setIsAdmin}
          setTicket={setTicket}
        ></Sidebar>
        <div className="main">
          <Header
            baseurl={baseurl}
            isLogin={isLogin}
            email={email}
            name={name}
            picture={picture}
          ></Header>

          <Routes>
            <Route path="/" element={<Main />} />
            <Route
              path="/RealtimeDescription"
              element={<RealtimeDescription />}
            />
            <Route path="/RTModeration" element={<RTModeration />} />
            <Route path="/RTPrivacy" element={<RTPrivacy />} />
            <Route
              path="/VideoEditorDescription"
              element={<VideoEditorDecsription />}
            />
            <Route
              path="/ModerationRequest"
              element={
                <ModerationRequest
                  baseurl={baseurl}
                  email={email}
                  name={name}
                  picture={picture}
                  isLogin={isLogin}
                  opt={opt}
                  ticket={ticket}
                  setEmail={setEmail}
                  setName={setName}
                  setPicture={setPicture}
                  setIsLogin={setIsLogin}
                  setOpt={setOpt}
                  setTicket={setTicket}
                />
              }
            />
            <Route
              path="/PrivacyProtectionRequest"
              element={
                <PrivacyProtectionRequest
                  baseurl={baseurl}
                  email={email}
                  name={name}
                  picture={picture}
                  isLogin={isLogin}
                  opt={opt}
                  ticket={ticket}
                  setEmail={setEmail}
                  setName={setName}
                  setPicture={setPicture}
                  setIsLogin={setIsLogin}
                  setOpt={setOpt}
                  setTicket={setTicket}
                />
              }
            />
            <Route
              path="/FaceDetectionRequest"
              element={
                <FaceDetectionRequest
                  baseurl={baseurl}
                  email={email}
                  name={name}
                  picture={picture}
                  isLogin={isLogin}
                  opt={opt}
                  ticket={ticket}
                  setEmail={setEmail}
                  setName={setName}
                  setPicture={setPicture}
                  setIsLogin={setIsLogin}
                  setOpt={setOpt}
                  setTicket={setTicket}
                />
              }
            />
            <Route
              path="/RequestDone"
              element={<RequestDone baseurl={baseurl} />}
            />
            <Route
              path="/login"
              element={
                <Login
                  baseurl={baseurl}
                  email={email}
                  name={name}
                  picture={picture}
                  isLogin={isLogin}
                  opt={opt}
                  isAdmin={isAdmin}
                  setEmail={setEmail}
                  setName={setName}
                  setPicture={setPicture}
                  setIsLogin={setIsLogin}
                  setOpt={setOpt}
                  setIsAdmin={setIsAdmin}
                />
              }
            />
            <Route
              path="/mypage"
              element={
                <MyPage
                  baseurl={baseurl}
                  email={email}
                  name={name}
                  opt={opt}
                  picture={picture}
                  isLogin={isLogin}
                  isAdmin={isAdmin}
                  ticket={ticket}
                  setIsLogin={setIsLogin}
                  setEmail={setEmail}
                  setName={setName}
                  setOpt={setOpt}
                  setPicture={setPicture}
                  setTicket={setTicket}
                />
              }
            />
            <Route
              path="/infochange"
              element={
                <InfoChange
                  baseurl={baseurl}
                  email={email}
                  name={name}
                  opt={opt}
                  picture={picture}
                  isLogin={isLogin}
                  setEmail={setEmail}
                  setName={setName}
                  setOpt={setOpt}
                  setPicture={setPicture}
                  setIsLogin={setIsLogin}
                />
              }
            />
            <Route
              path="/ticket"
              element={
                <Ticket
                  email={email}
                  picture={picture}
                  baseurl={baseurl}
                  ticket={ticket}
                  setTicket={setTicket}
                />
              }
            />
            <Route
              path="/editdone"
              element={<EditDone baseurl={baseurl} email={email} name={name} />}
            />
            <Route
              path="/editing"
              element={<Editing baseurl={baseurl} email={email} name={name} />}
            />
            <Route
              path="/editerror"
              element={
                <EditError baseurl={baseurl} email={email} name={name} />
              }
            />
            <Route
              path="/board"
              element={
                <Board
                  baseurl={baseurl}
                  name={name}
                  isAdmin={isAdmin}
                  isLogin={isLogin}
                />
              }
            />
            <Route
              path="/boardwrite"
              element={
                <BoardWrite
                  baseurl={baseurl}
                  isAdmin={isAdmin}
                  email={email}
                  name={name}
                  opt={opt}
                />
              }
            />
            <Route
              path="/board/:boardnum"
              element={
                <BoardSelected
                  baseurl={baseurl}
                  email={email}
                  isAdmin={isAdmin}
                  opt={opt}
                />
              }
            />
            <Route
              path="/announce"
              element={<Announce baseurl={baseurl} isAdmin={isAdmin} />}
            />
            <Route
              path="/annc/:boardnum"
              element={<AnnounceSelected baseurl={baseurl} />}
            />
            <Route
              path="/developing"
              element={<Developing baseurl={baseurl} />}
            />
            <Route path="/kakao-login/auth" element={<KakaoRedirect />} />
          </Routes>
        </div>
      </div>
      <Footer visible={visible} />
      <div className={`footer-container ${visible ? "" : "hidden"}`}>
        <button onClick={handleToggle} className="footer-button">
          <img
            src="images/uparrow.png"
            alt={visible ? "close banner" : "open banner"}
            style={{
              transform: visible ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
        <div className="footer-banner">
          <a
            href={longbanners[currentImageIndex].url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={longbanners[currentImageIndex].image} alt="long-banner" />
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
