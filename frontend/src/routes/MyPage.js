import "./MyPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Admin from "../components/Admin";
import User from "../components/User";

const MyPage = (props) => {
  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/infochange", { replace: true });
  };

  async function selectticket() {
    try {
      console.log("email: ", props.email);
      const email = props.email;
      const response = await axios.get(props.baseurl + "/selectticket", {
        params: { email: email },
      });
      console.log(response.data);

      const ticketData = [
        response.data["totalticket"],
        response.data["usedticket"],
        response.data["remainticket"],
      ];

      props.setTicket(ticketData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  function convertTime(ticketSeconds) {
    const hours = Math.floor(ticketSeconds / 3600);
    const minutes = Math.floor((ticketSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (ticketSeconds % 60).toString().padStart(2, "0");

    return `${hours}시간 ${minutes}분 ${seconds}초`;
  }

  useEffect(() => {
    selectticket();
  }, []);
  return (
    <>
      <div className="MyPageList">
        <div className="content">
          <div className="main-container">
            <h4 className="mini-title">내 정보</h4>
            <div className="info-box">
              <img
                src={props.picture}
                alt="User Profile"
                className="profile-img"
              />
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label">이메일</td>
                    <td className="label">이름</td>
                    <td className="label">메일 수신 여부</td>
                    <td className="label">
                      이용권{" "}
                      <Link to="/ticket">
                        <img
                          src="/images/external.png"
                          className="ticket-link"
                          alt="구매하기"
                        />
                        <span className="ticket-linktext">구매하기</span>
                      </Link>
                    </td>
                    <td rowSpan="10" className="button-box">
                      <button
                        onClick={handleChange}
                        style={{ cursor: "pointer" }}
                      >
                        수정하기
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="value">{props.email}</td>
                    <td className="value">{props.name}</td>
                    <td className="value">
                      {props.opt === "in" ? "받음" : "받지 않음"}
                    </td>
                    <td className="value">{convertTime(props.ticket[2])}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
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
