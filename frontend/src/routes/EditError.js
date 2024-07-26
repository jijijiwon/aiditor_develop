import "./EditDone.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function EditError(props) {
  const location = useLocation();
  const stateWorknum = { ...location.state };
  const stateFilename = { ...location.state };
  const worknum = stateWorknum.worknum;
  const filename = stateFilename.filename;
  const [errorDiscription, setErrorDiscription] = useState(
    "오류가 발생하여 작업을 중단했어요."
  );

  // console.log("worknum: ", worknum);
  // console.log("filename: ", filename);

  async function workingStatus() {
    try {
      const response = await axios.get(`${props.baseurl}/video-error`, {
        params: { worknum: worknum },
        headers: {
          "Content-Type": "application/json",
        },
      });

      let result = response.data["error"];
      setErrorDiscription(result);

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
            src="images/logo-sad.png"
            alt="Moderation Icon"
            style={{ height: "100px" }}
          />
        </div>
        <div className="wordcloud">
          <h2
            style={{
              color: "#F80D38",
              fontSize: "20px",
              margin: "20px",
              marginBottom: "0px",
            }}
          >
            편집 중 오류가 발생했어요!
          </h2>
          <p>오류 메세지: </p>
          <p
            style={{
              fontStyle: "italic",
              paddingTop: "0px",
              marginTop: "0px",
              marginBottom: "10px",
            }}
          >
            {errorDiscription}
          </p>
        </div>
      </div>
    </>
  );
}

export default EditError;
