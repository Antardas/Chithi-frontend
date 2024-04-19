import React from 'react';
import Button from '~/Components/Button';
import '~/Components/Dialog/Dialog.scss'
const Dialog = ({ title, firstButtonText, secondButtonText, firstBtnHandler, secondBtnHandler }: DialogProps) => {
  return (
    <div className="dialog-container" data-testid="dialog-container">
      <div className="dialog">
        <h4>{title}</h4>
        <div className="btn-container">
          <Button className="btn button cancel-btn" label={secondButtonText} handleClick={secondBtnHandler} />
          <Button className="btn button confirm-btn" label={firstButtonText} handleClick={firstBtnHandler} />
        </div>
      </div>
    </div>
  );
};

export default Dialog;

export interface DialogProps {
  title: string;
  firstButtonText: string;
  secondButtonText: string;
  firstBtnHandler: () => void;
  secondBtnHandler: () => void;
}
