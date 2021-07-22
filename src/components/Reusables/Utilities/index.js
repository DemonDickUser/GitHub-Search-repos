import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import LoopIcon from "@material-ui/icons/Loop";
import React from "react";

export const Tooltip = ({ tip }) => {
  return <div className="tooltip">{tip}</div>;
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
