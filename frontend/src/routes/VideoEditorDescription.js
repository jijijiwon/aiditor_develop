import { useState, React, useEffect } from "react";
import "./Description.css";
import DesM from "../components/DesM";
import DesP from "../components/DesP";
import DesF from "../components/DesF";

function VideoEditorDecsription() {
  const [menu, setMenu] = useState("M");

  const items_p = ["신용카드", "영수증", "자동차 번호판"];

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
        <h2 style={{ color: "#100DB1" }}>AIditor 사용법💡</h2>
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
                🛡 유해정보 블라인드
              </h3>
              <div className="linktext">
                이 기능은 영상 속 유해정보를 모자이크합니다.
              </div>
            </div>
            <div
              className={`tooltip ${menu === "P" ? "active" : ""}`}
              id="rt-menu"
            >
              <h3 className="link-keyword" onClick={() => handleMenuClick("P")}>
                🔐 개인정보 보호
              </h3>
              <div className="linktext">
                이 기능은 영상 속 개인정보를 모자이크합니다.
              </div>
            </div>
            <div
              className={`tooltip ${menu === "F" ? "active" : ""}`}
              id="rt-menu"
            >
              <h3 className="link-keyword" onClick={() => handleMenuClick("F")}>
                🧒 얼굴 감지
              </h3>
              <div className="linktext">
                이 기능은 영상 속 '나'를 제외한 모든 인물을 모자이크합니다.
              </div>
            </div>
          </div>
          {menu === "M" && <DesM />}
          {menu === "P" && <DesP />}
          {menu === "F" && <DesF />}

          {(() => {
            switch (menu) {
              case "F":
                return (
                  <div className="des-text">
                    <h3 style={{ color: "#100DB1" }}>얼굴 감지</h3>
                    <hr />
                    <p>
                      이 기능은 선택한 영상 속 '나'와 '타인'을 자동으로 인식,
                      편집해주는 기능입니다.
                    </p>
                    <div>
                      <p>
                        위의 화면과 같은 메뉴를 통해 직접 비디오를 선택하고,
                        인식할 인물을 입력하여 요청을 제출하면 이후의 모든
                        과정은 자동으로 진행됩니다. AIditor가 자동 편집을 마친
                        후에는 메일을 통해 안내받을 수 있습니다.
                      </p>
                      <p>
                        <h3 style={{ color: "#343434" }}>감지할 얼굴 입력</h3>-
                        '나'로 인식할 인물의 사진을 5장 입력해야 합니다.
                        AIditor는 이 사진으로 얼굴을 학습하여 타인과 구별합니다.
                        감지된 전체 인물 중 학습된 인물을 제외하고 모두 모자이크
                        됩니다.
                      </p>
                    </div>
                  </div>
                );
              default:
                return (
                  <div className="des-text" id="rt-moderation">
                    {menu === "M" ? (
                      <h3 style={{ color: "#100DB1" }}>유해정보 블라인드</h3>
                    ) : (
                      <h3 style={{ color: "#100DB1" }}>개인정보 보호</h3>
                    )}
                    <hr />
                    <p>
                      이 기능은 선택한 영상 속{" "}
                      {menu === "M" ? "유해정보" : "개인정보"}를 자동으로 인식,
                      편집해주는 기능입니다.
                    </p>
                    <div>
                      <p>
                        위의 화면과 같은 메뉴를 통해 직접 비디오를 선택하고,
                        편집할 컨텐츠와 옵션을 설정하여 요청을 제출하면 이후의
                        모든 과정은 자동으로 진행됩니다. AIditor가 자동 편집을
                        마친 후에는 메일을 통해 안내받을 수 있습니다.
                      </p>
                      <br />
                      {menu === "M" ? (
                        <p>
                          <h3 style={{ color: "#343434" }}>편집할 컨텐츠</h3>-
                          영상 속에서는
                          {labels_m.map(function (label, i) {
                            return <span key={i}>{label["label"]}</span>;
                          })}
                          중, 선택한 컨텐츠를 모자이크 합니다. 하나 이상의
                          컨텐츠를 선택해야 요청이 접수됩니다.
                        </p>
                      ) : (
                        <p>
                          <h3 style={{ color: "#343434" }}>편집할 컨텐츠</h3>-
                          영상 속에서는
                          {labels_p.map(function (label, i) {
                            return <span key={i}>{label["label"]}</span>;
                          })}
                          중, 선택한 컨텐츠를 모자이크 합니다. 하나 이상의
                          컨텐츠를 설정해야 요청이 접수됩니다.
                        </p>
                      )}

                      <p>
                        <h3 style={{ color: "#343434" }}>감지 정확도</h3>
                        - 감지 정확도는 '얼마나 예민하게 컨텐츠를 감지할
                        것인가'를 결정하는 옵션입니다. <br />
                        정확도가 높을 수록, 물체가 정확히 감지된 경우만
                        모자이크됩니다. 낮게를 선택하면 유사한 물체가 모두
                        모자이크될 수 있습니다.
                      </p>
                      <p>
                        <h3 style={{ color: "#343434" }}>모자이크 강도</h3>-
                        모자이크 강도는 '모자이크 입자의 크기'를 결정하는
                        옵션입니다. 강도가 높을 수록 큰 입자로 모자이크 됩니다.
                        아래 이미지를 참고하세요.
                      </p>
                    </div>
                    <h3 style={{ color: "#d4d4d4" }}>모자이크 예시</h3>
                    <div className="des-sample">
                      <figure>
                        <img src="./images/mosaic1.gif" alt="mosaic sample" />
                        <figcaption>모자이크 강도 : 약하게</figcaption>
                      </figure>
                      <figure>
                        <img src="./images/mosaic2.gif" alt="mosaic sample" />
                        <figcaption>모자이크 강도 : 중간</figcaption>
                      </figure>
                      <figure>
                        <img src="./images/mosaic3.gif" alt="mosaic sample" />
                        <figcaption>모자이크 강도 : 강하게</figcaption>
                      </figure>
                    </div>
                  </div>
                );
            }
          })()}
        </div>
      </div>
    </div>
  );
}

export default VideoEditorDecsription;
