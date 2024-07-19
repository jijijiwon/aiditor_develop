import React, { useState, useEffect } from "react";
import "./Board.css";
import Pagination from "../components/Pagination";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Board = (props) => {
  const navigate = useNavigate();
  const [boardlist, setBoardlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 8;
  console.log("Login? : ", props.isLogin, "isAdmin? : ", props.isAdmin);

  const handleWrite = () => {
    navigate("/boardwrite", { replace: true });
  };

  const handleNeedLogin = () => {
    alert("로그인이 필요한 서비스입니다🐱");
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewCnt = (boardnum) => {
    updateCnt(boardnum);
  };

  async function getBoardList() {
    try {
      const response = await axios.get(props.baseurl + "/getboardlist");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateCnt(boardnum) {
    try {
      const response = await axios.put(
        props.baseurl + "/updateboardcnt",
        { boardnum: boardnum },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getBoardList();
      console.log("Board List: ", result);
      setBoardlist(result.reverse());
      setPageCount(Math.ceil(result.length / itemsPerPage));
    };
    fetchData();
  }, []);

  const paginatedList = boardlist.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <h3 style={{ color: "#F80D38" }}>게시판</h3>
      <div className="main-container" style={{ height: "77vh" }}>
        <div className="board-header">
          <div>
            <h2>게시판</h2>
          </div>
          <div className="board-header-link">
            <Link to="/board" style={{ color: "#100db1", fontWeight: "bold" }}>
              문의 게시판
            </Link>
            <Link to="/announce">공지사항</Link>
          </div>
        </div>
        <div className="board-content">
          <table className="board-table">
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성시간</th>
                <th>조회수</th>
              </tr>
            </thead>
            {paginatedList.map((board, i) => (
              <tbody key={board.boardnum || i}>
                <tr>
                  <td>{board.boardnum}</td>
                  <td style={{ textAlign: "left" }}>
                    <Link
                      to={`/board/${board.boardnum}`}
                      onClick={() => handleViewCnt(board.boardnum)}
                    >
                      <img src="./images/lock_darkgray.png" alt="lock"></img>
                      {board.title} ({board.replynum})
                    </Link>
                  </td>
                  <td>
                    {board.writer[0]}{" "}
                    {board.writer.length > 2
                      ? "* " + board.writer.slice(-1)
                      : "*"}
                  </td>
                  <td>{board.wrdate}</td>
                  <td>{board.viewcnt}</td>
                </tr>
              </tbody>
            ))}
          </table>
          {pageCount > 1 && (
            <Pagination
              pageCount={pageCount}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          )}
        </div>
        {props.isAdmin === 0 ? (
          <div
            className="button-box"
            style={{ marginRight: "1.5em", height: "1em", marginBottom: "1em" }}
          >
            {props.isLogin === 1 ? (
              <button
                onClick={handleWrite}
                style={{ cursor: "pointer", height: "36px", fontSize: "16px" }}
              >
                글쓰기
              </button>
            ) : (
              <button
                onClick={handleNeedLogin}
                style={{ cursor: "pointer", height: "36px", fontSize: "16px" }}
              >
                글쓰기
              </button>
            )}
          </div>
        ) : (
          <div
            className="button-box"
            style={{ marginRight: "1.5em", height: "1em", marginBottom: "1em" }}
          ></div>
        )}
      </div>
    </>
  );
};

export default Board;
