import "./MyPage.css";
import { useNavigate } from "react-router-dom";
import Admin from "../components/Admin";
import User from "../components/User";

const MyPage = (props) => {
  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/infochange", { replace: true });
  };

  return (
    <>
      <div className="MyPageList">
        <div className="content">
          <div className="main-container">
            <h4 className="mini-title">내 정보</h4>
            <div className="info-box">
              <div className="info">
                <img src={props.picture} alt="User Profile"></img>
              </div>
              <div className="info">
                <p> 이메일 </p>
                <p className="pbold" style={{ paddingTop: "13px" }}>
                  {props.email}
                </p>
              </div>
              <div className="info">
                <p> 이름 </p>
                <p className="pbold"> {props.name} </p>
              </div>
              <div className="info">
                <p>메일 수신 여부</p>
                <p className="pbold">
                  {props.opt === "in" ? "받음" : "받지 않음"}
                </p>
              </div>
              <div className="button-box">
                <button onClick={handleChange} style={{ cursor: "pointer" }}>
                  수정하기
                </button>
              </div>
            </div>
            {props.isadmin === 1 ? (
              <Admin baseurl={props.baseurl} />
            ) : (
              <User baseurl={props.baseurl} email={props.email} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPage;
