import React from 'react';
import './Input.scss';
interface InputProps {
  name: string;
  type: string;
  value: string;
  className?: string;
  labelText?: string;
  placeHolder?: string;
  handleChange?(): void;
}

const Input = ({ className, labelText, name, placeHolder, type, value, handleChange }: InputProps) => {
  return (
    <div className="form-row">
      {labelText ?? (
        <label htmlFor={name} className="form-label">
          {labelText}
        </label>
      )}

      <input
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeHolder}
        type={type}
        className={`form-input ${className}`}
        autoComplete={''}
      />
    </div>
  );
};

export default Input;
