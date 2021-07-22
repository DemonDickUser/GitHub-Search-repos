import React from "react";

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
