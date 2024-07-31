import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import Pagination from "../components/Pagination";

const Admin = ({ baseurl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userlist, setUserlist] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 7;

  const openModal = () => {
    if (selectedUser) {
      setIsOpen(true);
      console.log("현재 선택된 사용자: ", selectedUser);
    }
  };
  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleToAdmin = async (email) => {
    try {
      await updateAdmin(email, 1);
      setIsOpen(false);
      await refreshUserList();

      setTimeout(() => {
        alert("사용자가 관리자로 변경되었습니다.");
      }, 100);
    } catch (error) {
      console.error("관리자 변경 중 오류 발생:", error);
      alert("관리자 변경 중 오류가 발생했습니다.");
    }
  };

  const handleToUser = async (email) => {
    try {
      await updateAdmin(email, 0);
      setIsOpen(false);
      await refreshUserList();

      setTimeout(() => {
        alert("관리자가 사용자로 변경되었습니다.");
      }, 100);
    } catch (error) {
      console.error("사용자 변경 중 오류 발생:", error);
      alert("사용자 변경 중 오류가 발생했습니다.");
    }
  };

  const canChangeToUser = () => {
    const adminCount = userlist.filter((user) => user.isadmin === 1).length;
    return adminCount > 1;
  };

  const refreshUserList = async () => {
    const result = await getUserList();
    const sortedresult = result
      .sort((a, b) => {
        if (a.isadmin === 1 && b.isadmin !== 1) return 1;
        if (a.isadmin !== 1 && b.isadmin === 1) return -1;
        return 0;
      })
      .reverse();
    setUserlist(sortedresult);
    setPageCount(Math.ceil(result.length / itemsPerPage));
  };

  async function getUserList() {
    try {
      const response = await axios.get(baseurl + "/selectalluser");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateAdmin(email, isadmin) {
    try {
      console.log("들어온 값: ", email, isadmin);
      const response = await axios.put(
        baseurl + "/updateadmin",
        { email: email, isadmin: isadmin },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    refreshUserList();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      openModal();
    }
  }, [selectedUser]);

  const paginatedList = userlist.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <h4 className="mini-title">사용자 목록</h4>
      <table className="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>메일 수신 여부</th>
            <th>관리자 여부</th>
            <th></th>
          </tr>
        </thead>
        {paginatedList.map((user, i) => (
          <tbody key={i}>
            <tr
              onClick={() => {
                setSelectedUser(user);
              }}
            >
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.opt === "in" ? "O" : "X"}</td>
              <td>{user.isadmin === 1 ? "O" : "X"}</td>
              <td></td>
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
      <Modal isOpen={isOpen} onReqeustClose={closeModal} style={modalStyle}>
        <div className="modal-container">
          <header
            className="modal-header"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              borderBottom: "none",
              padding: "16px 16px",
            }}
          >
            <button className="icon-button" onClick={closeModal}>
              <img src="images/close.png" alt="Close Icon" />
            </button>
          </header>
          {selectedUser && selectedUser.isadmin === 1 ? (
            <>
              <div className="modal-container-body">
                {canChangeToUser() ? (
                  <h3>관리자를 일반 사용자로 변경하시겠습니까?</h3>
                ) : (
                  <h3>마지막 관리자는 사용자로 변경할 수 없습니다.</h3>
                )}
              </div>
              <div
                className="modal-container-footer"
                style={{ borderTop: "none" }}
              >
                {canChangeToUser() ? (
                  <button
                    onClick={() =>
                      selectedUser && handleToUser(selectedUser.email)
                    }
                    className="button is-primary"
                  >
                    확인
                  </button>
                ) : null}
                {canChangeToUser() ? (
                  <button onClick={closeModal} className="button is-ghost">
                    취소
                  </button>
                ) : (
                  <button onClick={closeModal} className="button is-ghost">
                    확인
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="modal-container-body">
                <h3>사용자를 관리자로 변경하시겠습니까?</h3>
              </div>
              <div
                className="modal-container-footer"
                style={{ borderTop: "none" }}
              >
                <button
                  onClick={() =>
                    selectedUser && handleToAdmin(selectedUser.email)
                  }
                  className="button is-primary"
                >
                  확인
                </button>
                <button onClick={closeModal} className="button is-ghost">
                  취소
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Admin;
