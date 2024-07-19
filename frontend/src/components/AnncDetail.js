import React from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

const AnncDetail = ({ boardnum, title, content, wrdate }) => {
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div className="board-detail">
      <div className="detail-header">
        <h1>{title}</h1>
        <p>{wrdate}</p>
      </div>
      <div className="detail-content">
        <div dangerouslySetInnerHTML={createMarkup(content)} />
      </div>
      <div className="detail-footer">
        <Link to="/announce">&lt; 목록으로</Link>
      </div>
    </div>
  );
};

export default AnncDetail;
