import "./Main.css";

function Main(props) {
  var description = [
    {
      menu: "유해정보 블라인드",
      des: "이것의 기능은 유해정보를 인식하여 편집하는 것입니다. 유해정보는 이미지와 음성으로 구분되며, 이미지는 모자이크 처리, 음성은 삐처리가 진행됩니다. 이를 통하여 안전한 고품질의 비디오를 얻을 수 있습니다.",
      color: "#763CEF",
    },
    {
      menu: "개인정보 보호",
      des: "이것의 기능은 사용자 개인 정보를 인식하여 편집하는 것입니다.개인 정보와 관련된 신용 카드, 영수증, 자동차 번호판 등을 모자이크 하여 안전한 비디오를 제공합니다.",
      color: "#FECA57",
    },
    {
      menu: "얼굴 감지",
      des: "이것의 기능은 사용자의 얼굴을 인식하여 비디오를 편집하는 것입니다. 설정한 인물외 타인을 모자이크 하거나 등장 부분만을 추출하여 짧게 편집된 비디오를 제공합니다.",
      color: "#100DB4",
    },
  ];
  return (
    <div className="Main">
      <div className="content">
        <h2 style={{ color: "#F80D38" }}>AIditor에 오신 것을 환영합니다!</h2>
        <p>어떤 종류의 편집 기능을 원하시나요?</p>
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
      <div className="footer">
        <img
          src="/images/describe.png"
          alt="Face Extraction"
          style={{ width: "30%", marginRight: "20px" }}
        />
        <div>
          <h2>AIditor 사용법</h2>
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
