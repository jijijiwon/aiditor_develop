import React, { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Announce = (props) => {
  const navigate = useNavigate();
  const [annclist, setAnnclist] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 8;

  console.log("is Admin?: ", props.isAdmin);

  const handleWrite = () => {
    navigate("/boardwrite", { replace: true });
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewCnt = (boardnum) => {
    updateCnt(boardnum);
  };

  async function getAnncList() {
    try {
      const response = await axios.get(props.baseurl + "/getannouncelist");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateCnt(boardnum) {
    try {
      const response = await axios.put(
        props.baseurl + "/updateannccnt",
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
      const result = await getAnncList();
      console.log("Announce List: ", result);
      setAnnclist(result.reverse());
      setPageCount(Math.ceil(result.length / itemsPerPage));
    };
    fetchData();
  }, []);

  const paginatedList = annclist.slice(
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
            <Link to="/board">문의 게시판</Link>
            <Link
              to="/announce"
              style={{ color: "#100db1", fontWeight: "bold" }}
            >
              공지사항
            </Link>
          </div>
        </div>
        <div className="board-content">
          <table className="board-table">
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>작성시간</th>
                <th>조회수</th>
              </tr>
            </thead>
            {paginatedList.map((annc, i) => (
              <tbody key={annc.boardnum || i}>
                <tr>
                  <td>{annc.boardnum}</td>
                  <td style={{ textAlign: "left" }}>
                    <Link
                      to={`/annc/${annc.boardnum}`}
                      onClick={() => handleViewCnt(annc.boardnum)}
                    >
                      {annc.title}
                    </Link>
                  </td>
                  <td>{annc.writer}</td>
                  <td>{annc.wrdate}</td>
                  <td>{annc.viewcnt}</td>
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
        {props.isAdmin === 1 ? (
          <div
            className="button-box"
            style={{ marginRight: "1.5em", height: "1em", marginBottom: "1em" }}
          >
            <button
              onClick={handleWrite}
              style={{ cursor: "pointer", height: "36px", fontSize: "16px" }}
            >
              글쓰기
            </button>
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

export default Announce;
