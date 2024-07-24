import React, { useState, useEffect } from "react";
import "./Checkbox.css"; // CSS 파일을 별도로 작성

const CheckboxList = ({ items, onSelectionChange }) => {
  const [selectedItems, setSelectedItems] = useState(items);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  const handleCheckboxChange = (value) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(value)) {
        return prevSelectedItems.filter((item) => item !== value);
      } else {
        return [...prevSelectedItems, value];
      }
    });
  };

  return (
    <div>
      <div className="checkbox-list">
        {items.map((item) => (
          <div key={item} className="checkbox-item">
            <input
              type="checkbox"
              id={item}
              value={item}
              checked={selectedItems.includes(item)}
              onChange={() => handleCheckboxChange(item)}
              className="checkbox-input"
            />
            <label
              htmlFor={item}
              className={`checkbox-label ${
                selectedItems.includes(item) ? "checked" : ""
              }`}
              style={{ marginBottom: "5px", marginTop: "10px" }}
            >
              {item}
            </label>
          </div>
        ))}
      </div>
      <div className="selected-items">
        <p>선택된 항목: {selectedItems.join(", ")}</p>
      </div>
    </div>
  );
};

export default CheckboxList;
