import { useParams } from "react-router-dom";
import axios from "axios";
import BoardDetail from "../components/BoardDetail";
import { useEffect, useState } from "react";

const BoardSelected = (props) => {
  const { boardnum } = useParams();
  const [board, setBoard] = useState({});
  const [loading, setLoading] = useState(true);

  async function getBoard() {
    try {
      console.log("boardnum: ", boardnum);
      const response = await axios.get(props.baseurl + "/getboard", {
        params: { boardnum: boardnum },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getBoard();
      console.log(result);
      setBoard(result);
    };
    fetchData();
    setLoading(false);
  }, []);

  return (
    <>
      <h3 style={{ color: "#F80D38" }}>문의 게시판</h3>
      <div className="main-container">
        {loading ? (
          <h2>loading...</h2>
        ) : (
          <BoardDetail
            key={props.email}
            boardnum={boardnum}
            title={board.title}
            content={board.content}
            writer={board.writer}
            wrdate={board.wrdate}
            wremail={board.wremail}
            email={props.email}
            isAdmin={props.isAdmin}
            opt={props.opt}
            baseurl={props.baseurl}
          />
        )}
      </div>
    </>
  );
};

export default BoardSelected;
