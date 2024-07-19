import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header(props) {
  const navigate = useNavigate();
  //로그인 staus 만들기

  const handleUserinfoClick = () => {
    if (!props.isLogin) {
      alert("로그인이 필요한 서비스입니다🐱");
      navigate("/login");
    } else {
      navigate("/mypage");
    }
  };

  return (
    <div className="header user-card">
      {props.name ? <h2>반가워요! {props.name}:-)</h2> : <h2>환영합니다!</h2>}
      <div className="user-info" onClick={handleUserinfoClick}>
        <span>{props.name || "Login"}</span>
        <img
          src={props.picture || "./images/profile.png"}
          alt="User Profile"
          width="40"
          height="40"
        />
      </div>
    </div>
  );
}

export default Header;
