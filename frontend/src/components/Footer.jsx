import "./Footer.css";

const Footer = (props) => {
  return (
    <div
      className="footer"
      style={{ marginBottom: props.visible ? "105px" : "0px" }}
    >
      <h1>아이크</h1>
      <p>© 2024. AIc. All Rights Reserved.</p>
      <p>사용된 영상은 작업 후 모두 폐기됩니다.</p>
    </div>
  );
};

export default Footer;
