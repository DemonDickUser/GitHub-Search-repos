import React from "react";
import "./style.css";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import LoopIcon from "@material-ui/icons/Loop";

export const Tooltip = ({ tip }) => {
  return <div className="tooltip">{tip}</div>;
};

export const Input = ({
  className,
  onBlur,
  id,
  onFocus,
  onChange,
  placeholder,
  type,
  key,
  onClick,
  value,
}) => {
  if (value === undefined) {
  }
  return (
    <input
      value={value}
      onFocus={onFocus}
      onClick={onClick}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={placeholder}
      id={id}
      className={className}
      type={type}
      key={key}
    />
  );
};

export const DropDown = ({ text, onClick, className }) => {
  return (
    <div className={className} onClick={onClick}>
      {text}
    </div>
  );
};

export const Select = ({ className, onClick, text }) => {
  return (
    <div className={className} onClick={onClick}>
      {text} <ArrowDropDownIcon />
    </div>
  );
};

export const Loading = () => {
  return (
    <div className="loading">
      <LoopIcon />
    </div>
  );
};
