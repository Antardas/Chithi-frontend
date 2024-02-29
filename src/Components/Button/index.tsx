import React, { ReactNode } from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode;
  className?: string;
  handleClick?(event: React.MouseEvent<HTMLButtonElement>): void;

  disabled?: boolean;
}
const Button = ({ label, handleClick, className = '', disabled = false }: ButtonProps) => {
  return (
    <button className={className} disabled={disabled} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;
