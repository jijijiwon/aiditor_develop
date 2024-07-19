import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import "./Login.css";

const GoogleLoginButton = (props) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  let user = { email: "", name: "", picture: "" };

  const navigate = useNavigate();

  // 로그인시 로그인 정보 전달

  async function getUser() {
    try {
      console.log("email: ", user.email);
      const response = await axios.get(props.baseurl + "/selectuser", {
        params: { email: user.email },
      });
      console.log(response.data);
      if (response.data !== null) {
        return response.data;
      } else {
        return await addUser();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addUser() {
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

  return (
    <div className="login-section">
      <div className="login-icon">
        <img src="./images/logo.png" alt="Login Icon" />
        <h3 style={{ textAlign: "center" }}>LOGIN</h3>
      </div>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            let profile = jwtDecode(credentialResponse.credential);
            console.log("profile: ", profile);
            user.email = profile.email;
            user.name = profile.name;
            user.picture = profile.picture;
            let response = await getUser();
            console.log("Login Success:", response);

            props.setEmail(response.email);
            props.setName(response.name);
            props.setPicture(response.picture);
            props.setOpt(response.opt);
            props.setIsLogin(1);
            response.isadmin === 1 ? props.setIsAdmin(1) : props.setIsAdmin(0);
            console.log(
              "Login Success:",
              "email: ",
              props.email,
              "name: ",
              props.name,
              "picture: ",
              props.picture,
              "opt: ",
              props.opt,
              "isAdmin: ",
              props.isAdmin
            );
            navigate(-1, { replace: true });
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginButton;
