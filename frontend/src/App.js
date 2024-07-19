import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Main from "./routes/Main";
import ModerationRequest from "./routes/ModerationRequest";
import RequestDone from "./routes/RequestDone";
import PrivacyProtectionRequest from "./routes/PrivacyProtectionRequest";
import FaceDetectionRequest from "./routes/FaceDetectionRequest";
import Login from "./routes/Login";
import MyPage from "./routes/MyPage";
import InfoChange from "./routes/InfoChange";
import EditDone from "./routes/EditDone";
import Board from "./routes/Board";
import BoardWrite from "./routes/BoardWrite";
import BoardSelected from "./routes/BoardSelected";
import Announce from "./routes/Announce";
import AnnounceSelected from "./routes/AnnounceSelected";
import Developing from "./routes/Developing";
import { Routes, Route } from "react-router-dom";
import Editing from "./routes/Editing";

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

  useEffect(() => {
    window.sessionStorage.setItem("email", email);
    window.sessionStorage.setItem("name", name);
    window.sessionStorage.setItem("picture", picture);
    window.sessionStorage.setItem("isLogin", isLogin);
    window.sessionStorage.setItem("opt", opt);
    window.sessionStorage.setItem("isAdmin", isAdmin);
  }, [name]);

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
        setEmail={setEmail}
        setName={setName}
        setPicture={setPicture}
        setIsLogin={setIsLogin}
        setOpt={setOpt}
        setIsAdmin={setIsAdmin}
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
            path="/ModerationRequest"
            element={
              <ModerationRequest
                baseurl={baseurl}
                email={email}
                name={name}
                picture={picture}
                isLogin={isLogin}
                opt={opt}
                setEmail={setEmail}
                setName={setName}
                setPicture={setPicture}
                setIsLogin={setIsLogin}
                setOpt={setOpt}
              />
            }
          />
          <Route
            path="/RequestDone"
            element={<RequestDone baseurl={baseurl} />}
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
                setEmail={setEmail}
                setName={setName}
                setPicture={setPicture}
                setIsLogin={setIsLogin}
                setOpt={setOpt}
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
                setEmail={setEmail}
                setName={setName}
                setPicture={setPicture}
                setIsLogin={setIsLogin}
                setOpt={setOpt}
              />
            }
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
                setIsLogin={setIsLogin}
                setEmail={setEmail}
                setName={setName}
                setOpt={setOpt}
                setPicture={setPicture}
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
            path="/editdone"
            element={<EditDone baseurl={baseurl} email={email} name={name} />}
          />
          <Route
            path="/editing"
            element={<Editing baseurl={baseurl} email={email} name={name} />}
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
