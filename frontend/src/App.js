import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
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
  const sessionEmail = window.sessionStorage.getItem("email");
  const sessionName = window.sessionStorage.getItem("name");
  const sessionPicture = window.sessionStorage.getItem("picture");
  const sessionIsLogin = window.sessionStorage.getItem("isLogin");
  const sessionopt = window.sessionStorage.getItem("opt");
  const sessionIsAdmin = window.sessionStorage.getItem("isAdmin");

  const [email, setEmail] = useState(sessionEmail || "");
  const [name, setName] = useState(sessionName || "");
  const [picture, setPicture] = useState(sessionPicture || "");
  const [isLogin, setIsLogin] = useState(sessionIsLogin || 0);
  const [opt, setOpt] = useState(sessionopt || "");
  const [isAdmin, setIsAdmin] = useState(sessionIsAdmin || 0);
  const [ticket, setTicket] = useState(["0", "0", "0"]);

  useEffect(() => {
    window.sessionStorage.setItem("email", email);
    window.sessionStorage.setItem("name", name);
    window.sessionStorage.setItem("picture", picture);
    window.sessionStorage.setItem("isLogin", isLogin);
    window.sessionStorage.setItem("opt", opt);
    window.sessionStorage.setItem("isAdmin", isAdmin);
  }, [email, name, picture, isLogin, opt, isAdmin]);

  return (
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
            element={<EditError baseurl={baseurl} email={email} name={name} />}
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
  );
}

export default App;
