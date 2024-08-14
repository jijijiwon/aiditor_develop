import "./Footer.css";

const Footer = (props) => {
  return (
    <div
      className="footer"
      style={{ marginBottom: props.visible ? "105px" : "0px" }}
    >
      <h1>아이크</h1>
      <p>© 2024. AIc. All Rights Reserved.</p>
      <p>자동 영상 모자이크 서비스, 아이크입니다.</p>
    </div>
  );
};

export default Footer;
