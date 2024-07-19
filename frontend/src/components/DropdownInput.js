import React, { useState, useRef, useEffect } from "react";
import "./DropdownInput.css";

const DropdownInput = ({ options, defaultValue, onSelect }) => {
  const [inputValue, setInputValue] = useState(defaultValue || options[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(defaultValue || options[0]);
  }, [defaultValue, options]);

  const handleSelect = (option) => {
    setInputValue(option);
    setShowDropdown(false);
    onSelect(option); // 선택된 옵션을 부모 컴포넌트로 전달
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  return (
    <div className="dropdown-input">
      <input
        type="text"
        value={inputValue}
        ref={inputRef}
        readOnly
        onClick={() => setShowDropdown(!showDropdown)}
        onBlur={handleBlur}
      />
      {showDropdown && (
        <ul className="dropdown-list">
          {options.map((option, index) => (
            <li key={index} onMouseDown={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;
