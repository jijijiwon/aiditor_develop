import "./Description.css";

function RealtimeDecsription() {
  const labels_m = ["칼", "총", "손가락 욕", "담배"];
  const labels_p = ["신용카드", "영수증", "자동차 번호판"];
  return (
    <div className="Main">
      <div className="content">
        <h2 style={{ color: "#100DB1" }}>AIditor 사용법💡</h2>
        <p>어떤 종류의 편집 기능을 원하시나요?</p>
      </div>
      <div className="des">
        <div className="des-background" id="rt-moderation">
          <div
            className="des-image"
            id="rt-moderation"
            style={{ alignItems: "left" }}
          >
            <img
              src="/images/Realtime-Moderation.png"
              alt="Realtime Description"
              style={{ width: "100%" }}
            />
          </div>
          <div className="des-text" id="rt-moderation">
            <h3 style={{ color: "#100DB1" }}>실시간 유해정보 블라인드</h3>
            <hr />
            <p>
              이 기능은 웹캠을 통해 보여지는 여러분의 영상에서 실시간으로
              유해정보를 모자이크합니다.
            </p>
            <div>
              <p>
                웹브라우저 설정에서 웹캠을 허용하면, 가운데 화면에 사용자의
                카메라 화면이 보여집니다. 왼쪽에 표시된 라벨, 즉
                {labels_m.map(function (label, i) {
                  return <span>{label}</span>;
                })}
                으로 인식되는 컨텐츠를 인식하고 모자이크 합니다.
              </p>
            </div>
          </div>
        </div>
        <div className="des-background" id="rt-privacy">
          <div
            className="des-image"
            id="rt-privacy"
            style={{ alignItems: "left" }}
          >
            <img
              src="/images/Realtime-Moderation.png"
              alt="Realtime Description"
              style={{ width: "100%" }}
            />
          </div>

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
                  return <span>{label}</span>;
                })}
                으로 인식되는 컨텐츠를 인식하고 모자이크 합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealtimeDecsription;
