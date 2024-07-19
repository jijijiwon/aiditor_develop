import "./EditDone.css";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function EditDone(props) {
  const location = useLocation();
  const stateWorknum = { ...location.state };
  const stateFilename = { ...location.state };
  const worknum = stateWorknum.worknum;
  const filename = stateFilename.filename;
  const [url, setUrl] = useState("다운로드링크");
  const [ODResult, setODResult] = useState([]);

  console.log("worknum: ", worknum);
  console.log("filename: ", filename);

  const isFirstLetterF = worknum.charAt(0) === "F";

  const labelColor = {
    knife: "#100DB1",
    gun: "#763CEF",
    middle_finger: "#FECA57",
    cigarrete: "#F80D38",
    credit_card: "#100DB1",
    receipt: "#F80D38",
    license_plate: "#FECA57",
  };
  const labelList = {
    knife: "칼🔪",
    gun: "총🔫",
    middle_finger: "손가락욕🖕",
    cigarrete: "담배🚬",
    credit_card: "신용카드💳",
    receipt: "영수증🧾",
    license_plate: "자동차번호판🚙",
  };

  async function getMyVideo() {
    try {
      const response = await axios.get(`${props.baseurl}/myvideo`, {
        params: { worknum: worknum },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);

      setUrl(response.data.url);

      if (isFirstLetterF === false) {
        const labels = response.data.labels
          .filter((label) => Object.values(label)[0] !== "0")
          .map((label) => ({
            [Object.keys(label)[0]]: Object.values(label)[0],
          }));

        setODResult(labels);

        console.log(response.data.url);
        console.log(labels);
      } else {
        setODResult([response.data.labels]);

        console.log(ODResult);
      }

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMyVideo();
  }, []);

  return (
    <>
      <h3 style={{ color: "#F80D38" }}>내 영상</h3>
      <div className="edit-done">
        <div className="icon">
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
            Complete!
          </h2>
          <p onClick={() => window.open(url)} style={{ fontStyle: "italic" }}>
            {filename}
          </p>
        </div>
        <button onClick={() => window.open(url)}>파일 다운로드</button>
        <div className="line">결과 요약</div>
        <div className="result-label">
          {isFirstLetterF ? (
            <div className="index-face">
              <img
                src="images/face.png"
                alt="Face Icon"
                style={{ height: "100px", marginRight: "20px" }}
              />
              <span>감지된 인물: {ODResult} </span>
            </div>
          ) : (
            <table>
              <tbody>
                {ODResult.map((label, i) => {
                  const key = Object.keys(label)[0];
                  return (
                    <tr key={i} className="list-index-label">
                      <td
                        className="color-chip"
                        style={{
                          backgroundColor: labelColor[key],
                        }}
                      ></td>
                      <td style={{ width: "30%" }}>{labelList[key]}</td>
                      <td>
                        <hr />
                      </td>
                      <td style={{ width: "15%", textAlign: "right" }}>
                        {Object.values(label)[0]}초
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default EditDone;
