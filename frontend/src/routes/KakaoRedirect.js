import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import Loading from "../components/Loading";

const KakaoRedirect = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  useEffect(() => {
    if (code) {
      const requestBody = new URLSearchParams();
      requestBody.append("grant_type", "authorization_code");
      requestBody.append("client_id", REST_API_KEY);
      requestBody.append("redirect_uri", REDIRECT_URI);
      requestBody.append("code", code);

      fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody.toString(),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const accessToken = data.access_token;

          // 카카오 API를 사용하여 사용자 정보 가져오기
          fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((response) => response.json())
            .then((userData) => {
              console.log(userData);
              navigate("/login", {
                state: {
                  email: userData.kakao_account.email,
                  name: userData.kakao_account.profile.nickname,
                  picture: userData.kakao_account.profile.profile_image_url
                    ? userData.kakao_account.profile.profile_image_url
                    : "./images/profile.png",
                },
              });
            })
            .catch((error) => {
              console.error("Failed to fetch user data:", error);
            });
        })
        .catch((error) => {
          console.error("오류 발생", error);
        });
    }
  }, [code, REST_API_KEY, REDIRECT_URI, navigate]);

  return (
    <div className="main-container">
      <Loading />
    </div>
  );
};

export default KakaoRedirect;
