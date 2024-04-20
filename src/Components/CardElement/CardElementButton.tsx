import React, { Fragment } from 'react';
import { NavigateFunction } from 'react-router-dom';
import Button from '../Button';

const CardElementButton = ({ btnTextOne, btnTextTwo, isChecked, navigateToProfile, onClickBtnOne, onClickBtnTwo }: ICardElementButtonProps) => {
  return (
    <div className="card-element-buttons" data-testid="card-element-buttons">
      <Fragment>
        {!isChecked ? (
          <Button label={btnTextOne} className="card-element-buttons-btn button" handleClick={onClickBtnOne} />
        ) : (
          <Button label={btnTextTwo} className="card-element-buttons-btn button isUserFollowed" handleClick={onClickBtnTwo} />
        )}
      </Fragment>
      <Button label={'Profile'} className="card-element-buttons-btn button" handleClick={navigateToProfile} />{' '}
    </div>
  );
};

export default CardElementButton;

export interface ICardElementButtonProps {
  isChecked: boolean;
  btnTextOne: string;
  btnTextTwo: string;
  onClickBtnOne: () => void;
  onClickBtnTwo: () => void;
  navigateToProfile: () => void;
}
