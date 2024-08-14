import "./Main.css";

function Main(props) {
  var description = [
    {
      menu: "유해 정보 블라인드",
      des: "유해 정보 블라인드에서는 유해 정보를 인식하고, 인식된 이미지에 모자이크 처리를 진행합니다. 이를 통하여 안전한 고품질의 비디오를 제공합니다.",
      color: "#763CEF",
    },
    {
      menu: "개인정보 보호",
      des: "개인정보 보호에서는 사용자 및 타인의 개인정보를 인식하고, 인식된 이미지에 모자이크 처리를 진행합니다. 개인 정보와 관련된 신용 카드, 영수증, 자동차 번호판 등이 모자이크되며, 이를 통하여 안전한 비디오를 제공합니다.",
      color: "#FECA57",
    },
    {
      menu: "얼굴 감지",
      des: "얼굴 감지에서는 사용자의 얼굴을 인식하여 비디오를 편집합니다. 설정한 인물 외의 타인이 모자이크되며, 이를 통하여 안전한 비디오를 제공합니다.",
      color: "#100DB4",
    },
  ];
  return (
    <div className="Main">
      <div className="content">
        <h2 style={{ color: "#F80D38", marginBottom: "16px" }}>
          아이크에 오신 것을 환영합니다!
        </h2>
        <div className="cards">
          <div className="card" id="moderation">
            <img src="/images/moderationdes.png" alt="Moderation" />
          </div>
          <div className="card" id="label-mosaic">
            <img src="/images/privacydes.png" alt="Label Mosaic" />
          </div>
          <div className="card" id="face-extraction">
            <img src="/images/facedes.png" alt="Face Extraction" />
          </div>
        </div>
      </div>
      <div className="main-footer">
        <img
          src="/images/describe.png"
          alt="Face Extraction"
          style={{ width: "30%", marginRight: "20px" }}
        />
        <div>
          <h2>아이크 사용법</h2>
          <div>
            {description.map(function (menu, i) {
              return (
                <div className="description-list" key={i}>
                  <div className="title">
                    <li
                      style={{
                        color: description[i].color,
                      }}
                    >
                      <h4 style={{ display: "inline" }}>
                        {description[i].menu}
                      </h4>
                    </li>
                  </div>
                  <p>{description[i].des}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
