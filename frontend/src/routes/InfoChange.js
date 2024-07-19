import "./InfoChange.css";
import DropdownInput from "../components/DropdownInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";

function InfoChange(props) {
  const options = ["수신 동의", "수신 비동의"];
  const opt = ["in", "out"];
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options[opt.indexOf(props.opt)]
  ); // 상태 추가

  function handleSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("User-name").value;
    const resopt = opt[options.indexOf(selectedOption)]; // 선택된 옵션 사용
    props.setName(name);
    props.setOpt(resopt);
    updateUser(name, resopt);
    navigate("/mypage", { replace: true });
  }

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      setIsOpen(false);
      props.setName("");
      props.setEmail("");
      props.setPicture("");
      props.setIsLogin(false);
      props.setOpt("");
      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          alert("회원탈퇴가 완료되었습니다.");
        }, 100);
      }, 0);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  };

  const modalStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
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

  async function deleteUser() {
    try {
      const response = await axios.delete(props.baseurl + "/deleteuser", {
        params: { email: props.email },
      });
      console.log("User Deleted: ", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function updateUser(name, opt) {
    try {
      const response = await axios.put(
        props.baseurl + "/updateuser",
        { email: props.email, name: name, opt: opt },
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

  return (
    <div>
      <div className="user-info-update">
        <div className="user-update-icon">
          <img src="./images/logo.png" alt="user-update Icon" />
          <h3>사용자 정보 수정</h3>
        </div>
        <form className="user-update" onSubmit={handleSubmit}>
          <label htmlFor="Email">이메일</label>
          <input type="text" id="User-Email" value={props.email} readOnly />
          <label htmlFor="Name">이름</label>
          <input type="text" id="User-name" defaultValue={props.name} />
          <label htmlFor="Email-Alarm">이메일 수신 여부</label>
          <DropdownInput
            options={options}
            defaultValue={selectedOption} // 디폴트 값 설정
            onSelect={setSelectedOption} // 콜백 함수 추가
          />
          <div className="user-update-button" onClick={handleSubmit}>
            저장
          </div>
        </form>
      </div>
      <p onClick={openModal} style={{ cursor: "pointer" }}>
        회원탈퇴 &gt;
      </p>
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={modalStyle}>
        <div className="modal-container">
          <header className="modal-container-header">
            <div>
              <img
                src="images/mainlogo.png"
                alt="Logo"
                style={{ height: "40px", marginTop: "10px" }}
              />
            </div>
            <button className="icon-button" onClick={closeModal}>
              <img src="images/close.png" alt="Close Icon" />
            </button>
          </header>
          <div className="modal-container-body">
            <h3> 회원 탈퇴 안내 </h3>
            <p style={{ marginTop: "0", fontSize: "0.9em" }}>
              회원 탈퇴를 진행하기 전에 아래 항목을 확인해주세요.
            </p>
            <br />
            <h4>☑️탈퇴 후 데이터는 모두 삭제됩니다.</h4>
            <table>
              <tr>
                <th>개인 정보</th>
                <th style={{ borderTop: "none" }}>포함된 데이터</th>
              </tr>
              <tr>
                <td>이메일 주소, 이름 정보 삭제</td>
                <td style={{ borderTop: "none" }}>
                  회원이 맡긴 영상 편집 목록 삭제
                </td>
              </tr>
            </table>
            <br />
            <p style={{ color: "grey", fontSize: "0.8em" }}>
              회원 탈퇴시 데이터를 복구할 수 없으니 신중히 진행하세요.{" "}
            </p>
          </div>
          <footer className="modal-container-footer">
            <button onClick={closeModal} className="button is-ghost">
              뒤로가기
            </button>
            <button onClick={handleDelete} className="button is-primary">
              탈퇴하기
            </button>
          </footer>
        </div>
      </Modal>
    </div>
  );
}

export default InfoChange;
