import "./EditDone.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Editing(props) {
  const location = useLocation();
  const stateWorknum = { ...location.state };
  const stateFilename = { ...location.state };
  const worknum = stateWorknum.worknum;
  const filename = stateFilename.filename;
  const [count, setCount] = useState(0);
  const [workStatus, setWorkStatus] = useState("작업");
  const [workDiscription, setWorkDiscription] =
    useState("편집을 진행하고 있어요.");

  console.log("worknum: ", worknum);
  console.log("filename: ", filename);

  async function workingStatus() {
    try {
      const response = await axios.get(`${props.baseurl}/video-list`, {
        params: { worknum: worknum },
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCount(response.data.count);
      if (response.data.count !== 0) {
        const disc =
          response.data.count + "번째 순서로 작업을 기다리고 있어요.";
        setWorkStatus("작업 대기");
        setWorkDiscription(disc);
      }

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    workingStatus();
  }, []);

  return (
    <>
      <h3 style={{ color: "#F80D38" }}>내 영상</h3>
      <div
        className="edit-done"
        style={{ height: "60vh", justifyContent: "center" }}
      >
        <div className="icon" style={{ marginBottom: "40px" }}>
          <img
            src="images/logo.png"
            alt="Moderation Icon"
            style={{ height: "100px" }}
          />
        </div>
        <div className="wordcloud">
          <h2
            style={{
              color: "#feca57",
              fontSize: "20px",
              margin: "20px",
              marginBottom: "0px",
            }}
          >
            {workStatus}중이에요!
          </h2>
          <p>
            {filename}은 현재 {workDiscription}
          </p>
        </div>
      </div>
    </>
  );
}

export default Editing;
