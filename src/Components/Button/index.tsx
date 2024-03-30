import React, { ReactNode } from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode;
  className?: string;
  handleClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  disabled?: boolean;
}
const Button = ({ label, handleClick, className = '', disabled = false, ...props }: ButtonProps) => {
  const onClick = props.onClick ? props.onClick : handleClick;
  return (
    <button className={className} disabled={disabled} onClick={onClick} {...props}>
      {label}
    </button>
  );
};

export default Button;
