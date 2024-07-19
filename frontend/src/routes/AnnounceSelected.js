import { useParams } from "react-router-dom";
import axios from "axios";
import AnncDetail from "../components/AnncDetail";
import { useEffect, useState } from "react";

const AnncSelected = (props) => {
  const { boardnum } = useParams();
  const [annc, setAnnc] = useState({});
  const [loading, setLoading] = useState(true);

  async function getAnnc() {
    try {
      console.log("boardnum: ", boardnum);
      const response = await axios.get(props.baseurl + "/getannounce", {
        params: { boardnum: boardnum },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAnnc();
      console.log(result);
      setAnnc(result);
    };
    fetchData();
    setLoading(false);
  }, []);

  return (
    <>
      <h3 style={{ color: "#F80D38" }}>공지사항</h3>
      <div className="main-container">
        {loading ? (
          <h2>loading...</h2>
        ) : (
          <AnncDetail
            boardnum={boardnum}
            title={annc.title}
            content={annc.content}
            wrdate={annc.wrdate}
            wremail={annc.wremail}
          />
        )}
      </div>
    </>
  );
};

export default AnncSelected;
