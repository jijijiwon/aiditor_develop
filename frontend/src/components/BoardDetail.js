import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const BoardDetail = ({
  baseurl,
  boardnum,
  title,
  content,
  writer,
  wrdate,
  wremail,
  email,
  isAdmin,
  opt,
}) => {
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [replyNum, setReplyNum] = useState(0);

  async function getReply(boardnum) {
    const response = await axios.get(baseurl + "/getreply", {
      params: { boardnum: boardnum },
    });
    console.log(response.data);
    return response.data;
  }

  async function addReply(data) {
    const response = await axios.post(baseurl + "/addreply", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  }

  async function updateReplynum(data) {
    const response = await axios.put(baseurl + "/updatereplynum", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  }

  async function sendEmail(boardnum) {
    try {
      const response = await axios.post(
        baseurl + "/sendemail2",
        { boardnum },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("이메일을 전송했습니다.", response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  const handleReplySubmit = async () => {
    const data1 = {
      boardnum: boardnum,
      content: reply,
    };

    await addReply(data1);
    if (opt === "in") {
      await sendEmail(boardnum);
    }

    const result = await getReply(boardnum);
    setReplies(result.reverse());
    setReplyNum(result.length);
    setReply("");

    const data2 = {
      boardnum: boardnum,
      replynum: result.length,
    };
    await updateReplynum(data2);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getReply(boardnum);
      console.log(result);
      setReplies(result.reverse());
      setReplyNum(result.length);
    };
    fetchData();
  }, [boardnum, email]);

  return (
    <div className="board-detail">
      {email === wremail || isAdmin === 1 ? (
        <>
          <div className="detail-header">
            <h1>{title}</h1>
            <p>{wrdate}</p>
          </div>
          <div className="detail-content">
            <p>{content}</p>
          </div>
          <div className="detail-reply">
            <h4> 댓글 ({replyNum})</h4>
            {replies.map((reply, i) => (
              <div key={i} className="detail-reply-content">
                <div className="reply-writer">
                  <img src="../images/logo.png" alt="logo" />
                  <span>AIditor</span>
                </div>
                <div className="reply-content">
                  <h5>{reply.content}</h5>
                  <p>{reply.wrdate}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="detail-header">
            <h1>{title}</h1>
            <p>{wrdate}</p>
          </div>
          <div className="detail-content">
            <p>작성자만 확인할 수 있는 게시글입니다.</p>
          </div>
          <div className="detail-reply">
            <h4> 댓글 ({replyNum})</h4>
          </div>
        </>
      )}
      {isAdmin === 1 ? (
        <>
          <div className="detail-reply-form">
            <textarea
              rows="3"
              name="write_reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            ></textarea>
            <input
              type="button"
              value="등록"
              id="reply_submit_btn"
              onClick={handleReplySubmit}
            />
          </div>
        </>
      ) : null}
      <div className="detail-footer">
        <Link to="/board">&lt; 목록으로</Link>
      </div>
    </div>
  );
};

export default BoardDetail;
