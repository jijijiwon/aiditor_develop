import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

const User = ({ baseurl, email }) => {
  const navigate = useNavigate();
  const [worklist, setWorklist] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isOpenw, setIsOpenw] = useState(false); // wait
  const [isOpenp, setIsOpenp] = useState(false); // process
  const [isOpend, setIsOpend] = useState(false); // done & error

  const openModalw = () => {
    setIsOpenw(true);
  };
  const openModalp = () => {
    setIsOpenp(true);
  };
  const openModald = () => {
    setIsOpend(true);
  };
  const closeModalw = () => {
    setIsOpenw(false);
    setSelectedWork(null);
  };
  const closeModalp = () => {
    setIsOpenp(false);
    setSelectedWork(null);
  };
  const closeModald = () => {
    setIsOpend(false);
    setSelectedWork(null);
  };

  const modalStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
      border: "none",
      background: "none",
    },
  };

  const handleClick = (worknum, filename, isprocess) => {
    if (isprocess === "N") {
      navigate(
        "/editdone",
        { state: { worknum: worknum, filename: filename } },
        { replace: true }
      );
    } else if (isprocess === "E") {
      navigate(
        "/editerror",
        { state: { worknum: worknum, filename: filename } },
        { replace: true }
      );
    } else {
      navigate(
        "/editing",
        { state: { worknum: worknum, filename: filename } },
        { replace: true }
      );
    }
  };

  const handleWait = (worknum) => {
    deleteWork(worknum);
    setIsOpenw(false);
    window.location.reload();
  };

  const handleDone = (worknum) => {
    deleteWork(worknum);
    setIsOpend(false);
    window.location.reload();
  };

  async function getWorkList() {
    try {
      // console.log("email: ", email);
      const response = await axios.get(baseurl + "/selectuserwork", {
        params: { email: email },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteWork(worknum) {
    try {
      const response = await axios.delete(baseurl + "/deletework", {
        params: { worknum: worknum },
      });
      // console.log("Work Deleted: ", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getWorkList();
      // console.log("Work List: ", result);

      const sortedresult = result.sort((a, b) => {
        const order = { Y: 3, E: 2, W: 1 };
        return order[b.isprocess] - order[a.isprocess];
      });

      setWorklist(sortedresult);
      // console.log("Sorted Work List: ", sortedresult);
    };
    fetchData();
  }, []);

  return (
    <>
      <h4 className="mini-title">내 영상</h4>
      <div className="video-box">
        <div className="list-index">
          <p style={{ paddingLeft: "4%", paddingRight: "15%" }}>영상 제목</p>
          <p>날짜</p>
          <p style={{ paddingLeft: "7%" }}>영상 길이</p>
          <p>작업 상태</p>
        </div>
        <div className="list-content">
          {worklist.map((work, i) => (
            <div key={work.worknum || i} className="list">
              <div className="list-index-content">
                <p
                  style={{
                    width: "5%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {work.wtype === "M" ? (
                    <img src="/images/M.png" alt="Moderation" />
                  ) : work.wtype === "F" ? (
                    <img src="/images/F.png" alt="Face Detection" />
                  ) : (
                    <img src="/images/P.png" alt="Privacy Protection" />
                  )}{" "}
                </p>
                <p
                  onClick={() =>
                    handleClick(work.worknum, work.filename, work.isprocess)
                  }
                  style={{
                    textAlign: "left",
                    paddingLeft: "1%",
                    width: "23%",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {work.filename}
                </p>
                <p style={{ width: "23%" }}>{work.date}</p>
                <p
                  style={{
                    color: "#f80d38",
                    width: "23%",
                    fontWeight: "bold",
                  }}
                >
                  {work.videolength}
                </p>
                {work.isprocess === "N" ? (
                  <p className="done">완료</p>
                ) : work.isprocess === "Y" ? (
                  <p className="processing">진행중</p>
                ) : work.isprocess === "E" ? (
                  <p className="error">중단</p>
                ) : (
                  <p className="waiting">대기중</p>
                )}
                <p>
                  <img
                    style={{
                      width: "14px",
                      height: "14px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    alt="Close Icon"
                    src="/images/close.png"
                    onClick={() => {
                      setSelectedWork(work);
                      if (work.isprocess === "N") {
                        openModald();
                      } else if (work.isprocess === "Y") {
                        openModalp();
                      } else if (work.isprocess === "E") {
                        openModald();
                      } else {
                        openModalw();
                      }
                    }}
                  />
                </p>
              </div>
            </div>
          ))}
          <Modal
            isOpen={isOpenw}
            onRequestClose={closeModalw}
            style={modalStyle}
          >
            <div className="modal-container">
              <header
                className="modal-container-header"
                style={{
                  justifyContent: "flex-end",
                  borderBottom: "none",
                  padding: "16px 16px",
                }}
              >
                <button className="icon-button" onClick={closeModalw}>
                  <img src="images/close.png" alt="Close Icon" />
                </button>
              </header>
              <div className="modal-container-body">
                <h3>영상 편집을 중단하시겠습니까?</h3>
              </div>
              <div
                className="modal-container-footer"
                style={{ borderTop: "none" }}
              >
                <button
                  onClick={() =>
                    selectedWork && handleWait(selectedWork.worknum)
                  }
                  className="button is-primary"
                >
                  확인
                </button>
                <button onClick={closeModalw} className="button is-ghost">
                  취소
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={isOpenp}
            onRequestClose={closeModalp}
            style={modalStyle}
          >
            <div className="modal-container">
              <header
                className="modal-container-header"
                style={{
                  justifyContent: "flex-end",
                  borderBottom: "none",
                  padding: "16px 16px",
                }}
              >
                <button className="icon-button" onClick={closeModalp}>
                  <img src="images/close.png" alt="Close Icon" />
                </button>
              </header>
              <div className="modal-container-body">
                <h3>편집중인 영상은 취소할 수 없습니다.</h3>
              </div>
              <div
                className="modal-container-footer"
                style={{ borderTop: "none" }}
              ></div>
            </div>
          </Modal>
          <Modal
            isOpen={isOpend}
            onRequestClose={closeModald}
            style={modalStyle}
          >
            <div className="modal-container">
              <header
                className="modal-container-header"
                style={{
                  justifyContent: "flex-end",
                  borderBottom: "none",
                  padding: "16px 16px",
                }}
              >
                <button className="icon-button" onClick={closeModald}>
                  <img src="images/close.png" alt="Close Icon" />
                </button>
              </header>
              <div className="modal-container-body">
                <h3>기록을 삭제하시겠습니까?</h3>
              </div>
              <div
                className="modal-container-footer"
                style={{ borderTop: "none" }}
              >
                <button
                  onClick={() =>
                    selectedWork && handleDone(selectedWork.worknum)
                  }
                  className="button is-primary"
                >
                  확인
                </button>
                <button onClick={closeModald} className="button is-ghost">
                  취소
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default User;
