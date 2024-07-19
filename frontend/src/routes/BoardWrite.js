import "./Board.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardWrite = (props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleAddAnnounce = async () => {
    const formData = {
      title: title,
      content: content,
    };
    try {
      addAnnounce(formData);
      setTimeout(() => {
        navigate("/announce", { replace: true });
        setTimeout(() => {
          alert("게시글 등록이 완료되었습니다.");
        }, 100);
      }, 0);
    } catch (error) {
      console.error("Error adding announce:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleAddBoard = async () => {
    const formData = {
      title: title,
      content: content,
      writer: props.name,
      wremail: props.email,
    };
    try {
      addBoard(formData);
      setTimeout(() => {
        navigate("/board", { replace: true });
        setTimeout(() => {
          props.opt === "in"
            ? alert("게시글이 등록되었습니다.")
            : alert(
                "게시글이 등록되었습니다. 답변 완료 이메일을 받으시려면 이메일 수신에 동의해주세요."
              );
        }, 100);
      }, 0);
    } catch (error) {
      console.error("Error adding board:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleClose = () => {
    console.log("isAdmin? ", props.isAdmin);
    props.isAdmin
      ? navigate("/announce", { replace: true })
      : navigate("/board", { replace: true });
  };

  async function addBoard(data) {
    try {
      const response = await axios.post(props.baseurl + "/addboard", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function addAnnounce(data) {
    try {
      const response = await axios.post(props.baseurl + "/addannounce", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h3 style={{ color: "#F80D38" }}>게시글 작성</h3>
      <div className="main-container">
        <div className="board-content">
          <table className="write-table">
            <tbody>
              <tr>
                <th style={{ padding: "1em 0em" }}>제목</th>
                <td>
                  <input
                    type="text"
                    className="input-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요."
                  />
                </td>
              </tr>
              <tr>
                <th style={{ verticalAlign: "top" }}>내용</th>
                <td>
                  <textarea
                    className="input-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="modal-container-footer"
          style={{ borderTop: "none", paddingTop: "0em" }}
        >
          {props.isAdmin ? (
            <button onClick={handleAddAnnounce} className="button is-primary">
              작성완료
            </button>
          ) : (
            <button onClick={handleAddBoard} className="button is-primary">
              작성완료
            </button>
          )}
          <button onClick={handleClose} className="button is-ghost">
            취소
          </button>
        </div>
      </div>
    </>
  );
};

export default BoardWrite;
