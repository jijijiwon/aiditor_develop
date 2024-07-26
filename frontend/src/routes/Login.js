import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import React, { useEffect } from "react";
import "./Login.css";

const Login = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let user = { email: "", name: "", picture: "" };

  const glogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // 액세스 토큰을 사용하여 사용자 정보 가져옴
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );

      console.log(userInfo.data);
      const profile = userInfo.data;

      user = {
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      };

      let response = await getUser(user);
      console.log("Login Success:", response);

      props.setEmail(response.email);
      props.setName(response.name);
      props.setPicture(response.picture);
      props.setOpt(response.opt);
      props.setIsLogin(1);
      response.isadmin === 1 ? props.setIsAdmin(1) : props.setIsAdmin(0);

      navigate(-1, { replace: true });
    },
    onError: () => console.log("Login Failed"),
  });

  const nlogin = () => {
    alert("아직 네이버 로그인이 불가능해요!");
  };

  const klogin = () => {
    const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoURL;
  };

  async function getUser(user) {
    try {
      console.log("email: ", user.email);
      const response = await axios.get(props.baseurl + "/selectuser", {
        params: { email: user.email },
      });
      console.log(response.data);
      if (response.data !== null) {
        return response.data;
      } else {
        return await addUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addUser(user) {
    try {
      const response = await axios.post(props.baseurl + "/adduser", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.email) {
        user = location.state;
        let response = await getUser(location.state);
        console.log("Login Success:", response);

        props.setEmail(response.email);
        props.setName(response.name);
        props.setPicture(response.picture);
        props.setOpt(response.opt);
        props.setIsLogin(1);
        response.isadmin === 1 ? props.setIsAdmin(1) : props.setIsAdmin(0);

        navigate("/", { replace: true });
      }
    };
    fetchData();
  }, [location]);

  return (
    <div className="login-section">
      <div className="login-icon">
        <img src="./images/logo.png" alt="Login Icon" />
        <h3 style={{ textAlign: "center" }}>LOGIN</h3>
      </div>
      <button
        onClick={() => glogin()}
        className="social-button"
        id="custom-google-button"
      >
        <img src="./images/google.png" alt="Google Login" />
        <span>구글로 로그인</span>
      </button>
      <button
        onClick={() => nlogin()}
        className="social-button"
        id="custom-naver-button"
      >
        <img src="./images/naver.png" alt="Naver Login" />
        <span>네이버로 로그인</span>
      </button>
      <button
        onClick={() => klogin()}
        className="social-button"
        id="custom-kakao-button"
      >
        <img src="./images/kakao.png" alt="Kakao Login" />
        <span>카카오로 로그인</span>
      </button>
    </div>
  );
};

export default Login;
