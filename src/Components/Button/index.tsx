import React, { ReactNode } from 'react';
interface ButtonProps {
  label: string | ReactNode;
  className?: string;
  handleClick?(): void;
  disabled: boolean;
}
const Button = ({ label, handleClick, className = '', disabled = false }: ButtonProps) => {
  return (
    <button className={className} disabled={disabled} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;
