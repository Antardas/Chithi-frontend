import React, { forwardRef } from 'react';
import './Input.scss';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  id: string;
  type: string;
  // value: React.InputHTMLAttributes<string | number | boolean | readonly string[] |undefined>;
  // value: string | number | boolean | readonly string[] | undefined;
  className?: string;
  labelText?: string;
  placeHolder?: string;
  handleChange?(event: React.ChangeEvent<HTMLInputElement>): void;
}

type Ref = HTMLInputElement;

const Input = forwardRef<Ref, InputProps>(({ id, className, labelText, name, placeHolder, type, value, handleChange, style, ...rest }, ref) => {
  return (
    <div className="form-row">
      {labelText ? (
        <label htmlFor={name} className="form-label">
          {labelText}
        </label>
      ) : (
        ''
      )}

      <input
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeHolder}
        type={type}
        className={`form-input ${className}`}
        autoComplete={''}
        style={style}
        ref={ref}
        {...rest}
      />
    </div>
  );
});

export default Input;
