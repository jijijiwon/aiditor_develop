import { useState, React } from "react";
import "./Description.css";

function RealtimeDecsription() {
  const [menu, setMenu] = useState("M");

  const labels_m = [
    { label: "칼", kor: "칼🔪", color: "#100DB1" },
    { label: "총", kor: "총🔫", color: "#763CEF" },
    { label: "손가락 욕", kor: "손가락 욕🖕", color: "#FECA57" },
    { label: "담배", kor: "담배🚬", color: "#F80D38" },
  ];
  const labels_p = [
    { label: "신용카드", kor: "신용카드💳", color: "#100DB1" },
    { label: "영수증", kor: "영수증🧾", color: "#F80D38" },
    { label: "자동차 번호판", kor: "자동차 번호판🚙", color: "#FECA57" },
  ];

  const handleMenuClick = (menu) => {
    setMenu(menu);
  };

  return (
    <div className="Main">
      <div className="content">
        <h2 style={{ color: "#100DB1" }}>아이크 사용법💡</h2>
        <p>궁금한 기능에 마우스를 올려보세요!</p>
      </div>
      <div className="des">
        <div className="des-background">
          <div className="des-menu">
            <div
              className={`tooltip ${menu === "M" ? "active" : ""}`}
              id="rt-menu"
            >
              <h3 className="link-keyword" onClick={() => handleMenuClick("M")}>
                🛡 실시간 유해 정보 블라인드
              </h3>
              <div className="linktext">
                이 기능은 웹캠을 통해 보여지는 여러분의 영상에서 실시간으로 유해
                정보를 모자이크합니다.
              </div>
            </div>
            <div
              className={`tooltip ${menu === "P" ? "active" : ""}`}
              id="rt-menu"
            >
              <h3 className="link-keyword" onClick={() => handleMenuClick("P")}>
                🔐 실시간 개인정보 보호
              </h3>
              <div className="linktext">
                이 기능은 웹캠을 통해 보여지는 여러분의 영상에서 실시간으로
                개인정보를 모자이크합니다.
              </div>
            </div>
          </div>
          <div className="des-image" id="rt-moderation">
            <div className="rt-moderation" id="rt-moderation-des">
              <div className="label-list" style={{ width: "20%" }}>
                <div className="tooltip">
                  <h5 className="link-keyword">유의사항</h5>
                  <p className="link-keyword" style={{ marginTop: "10px" }}>
                    웹캠 허용 필수!📸
                  </p>
                  <div className="linktext">
                    웹브라우저 설정에서 웹캠을 허용해야만, 가운데 화면에
                    사용자의 카메라 화면이 보여집니다.
                  </div>
                </div>
                <div className="tooltip">
                  <h5>감지하는 컨텐츠</h5>
                  {menu === "M"
                    ? labels_m.map((label, i) => (
                        <div id="label-list" key={i}>
                          <div className="title">
                            <li
                              style={{
                                color: label.color,
                              }}
                            >
                              <p style={{ display: "inline", color: "black" }}>
                                {label.kor}
                              </p>
                            </li>
                          </div>
                        </div>
                      ))
                    : labels_p.map((label, i) => (
                        <div id="label-list" key={i}>
                          <div className="title">
                            <li
                              style={{
                                color: label.color,
                              }}
                            >
                              <p style={{ display: "inline", color: "black" }}>
                                {label.kor}
                              </p>
                            </li>
                          </div>
                        </div>
                      ))}
                  <div className="linktext">
                    표시된 라벨인
                    {menu === "M"
                      ? labels_m.map((label, i) => (
                          <span key={i}>{label.label}</span>
                        ))
                      : labels_p.map((label, i) => (
                          <span key={i}>{label.label}</span>
                        ))}
                    으로 인식되는 컨텐츠를 인식하고 모자이크 합니다.
                  </div>
                </div>
              </div>
              <div
                style={{ width: "60%", margin: "5% 20% 5% 0%" }}
                className="tooltip"
              >
                {menu === "M" ? (
                  <img
                    src="/images/sample_m.gif"
                    alt="sample"
                    className="link-keyword"
                    id="sample-video"
                  />
                ) : (
                  <img
                    src="/images/sample_p.gif"
                    alt="sample"
                    className="link-keyword"
                    id="sample-video"
                  />
                )}
                <div className="linktext" style={{ left: "80%" }}>
                  이 박스 안에 웹캠이 실시간으로 보여집니다.
                </div>
              </div>
            </div>
          </div>
          {menu === "M" ? (
            <div className="des-text">
              <h3 style={{ color: "#100DB1" }}>실시간 유해 정보 블라인드</h3>
              <hr />
              <p>
                이 기능은 웹캠을 통해 보여지는 여러분의 영상에서 실시간으로 유해
                정보를 모자이크합니다.
              </p>
              <div>
                <p>
                  웹브라우저 설정에서 웹캠을 허용하면, 가운데 화면에 사용자의
                  카메라 화면이 보여집니다. 왼쪽에 표시된 라벨인
                  {labels_m.map(function (label, i) {
                    return <span key={i}>{label["label"]}</span>;
                  })}
                  을 인식하고 모자이크 합니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="des-text">
              <h3 style={{ color: "#100DB1" }}>실시간 개인정보 보호</h3>
              <hr />
              <p>
                이 기능은 웹캠을 통해 보여지는 여러분의 영상에서 실시간으로
                개인정보를 모자이크합니다.
              </p>
              <div>
                <p>
                  웹브라우저 설정에서 웹캠을 허용하면, 가운데 화면에 사용자의
                  카메라 화면이 보여집니다. 왼쪽에 표시된 라벨, 즉
                  {labels_p.map(function (label, i) {
                    return <span key={i}>{label.label}</span>;
                  })}
                  을 인식하고 모자이크 합니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RealtimeDecsription;
