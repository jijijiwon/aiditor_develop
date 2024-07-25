import { useEffect, useState } from "react";
import axios from "axios";

function Ticket(props) {
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

    return `${hours}:${minutes}:${seconds}`;
  }

  const handleTicketBuying = async (newticket) => {
    try {
      const email = props.email;
      const newtotalticket = (parseInt(props.ticket[0]) + newticket).toString();
      const newremainticket = (
        parseInt(props.ticket[2]) + newticket
      ).toString();
      const response = await axios.put(
        `${props.baseurl}/updatetotalticket`,
        {
          email: email,
          totalticket: newtotalticket,
          remainticket: newremainticket,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 응답 데이터가 올바른지 확인
      if (response.status !== 200) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // 상태 업데이트
      props.setTicket([newtotalticket, props.ticket[1], newremainticket]);
      alert("이용권 구매가 완료되었습니다!🥳");
    } catch (error) {
      if (error.response) {
        // 서버 응답이 있는 경우
        console.error(
          "Error occurred during ticket buying:",
          error.response.data
        );
      } else {
        // 서버 응답이 없는 경우
        console.error("Error occurred during ticket buying:", error.message);
      }
    }
  };

  useEffect(() => {
    selectticket();
  }, []);

  return (
    <>
      <div className="MyPageList">
        <div className="content">
          <div className="main-container">
            <h4 className="mini-title" style={{ color: "#100DB1" }}>
              나의 이용권
            </h4>
            <div className="ticket-info">
              <div className="info">
                <img src={props.picture} alt="User Profile"></img>
              </div>
              <div className="info">
                <p> 총 이용권 </p>
                <p className="pbold" style={{ paddingTop: "13px" }}>
                  {convertTime(props.ticket[0])}
                </p>
              </div>
              <div className="info">
                <p> 사용한 이용권 </p>
                <p className="pbold" style={{ paddingTop: "13px" }}>
                  {convertTime(props.ticket[1])}
                </p>
              </div>
              <div className="info">
                <p> 남은 이용권 </p>
                <p className="pbold" style={{ paddingTop: "13px" }}>
                  {convertTime(props.ticket[2])}
                </p>
              </div>
            </div>
            <div>
              <h4 className="mini-title">이용권 구매</h4>
              <div className="ticket-list">
                <div className="ticket-type">
                  <img src="/images/ticket1.png" alt="ticket" />
                  10분
                  <button
                    className="ticket-button"
                    onClick={() => handleTicketBuying(600)}
                  >
                    구매하기
                  </button>
                </div>
                <div className="ticket-type">
                  <img src="/images/ticket2.png" alt="ticket" />
                  1시간
                  <button
                    className="ticket-button"
                    onClick={() => handleTicketBuying(3600)}
                  >
                    구매하기
                  </button>
                </div>
                <div className="ticket-type">
                  <img src="/images/ticket3.png" alt="ticket" />
                  2시간
                  <button
                    className="ticket-button"
                    onClick={() => handleTicketBuying(7200)}
                  >
                    구매하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Ticket;
