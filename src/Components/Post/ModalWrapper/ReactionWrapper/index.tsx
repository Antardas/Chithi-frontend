import React from 'react';
import { BiX } from 'react-icons/bi';
import '~/Components/Post/ModalWrapper/ReactionWrapper/ReactionWrapper.scss';
import { SetState } from '~/types/utils';
const  ReactionWrapper = ({ children, closeModal }: IReactionWrapperProps) => {
  return (
    <>
      <div className="modal-wrapper" data-testid="modal-wrapper">
        <div className="modal-wrapper-container">
          <div className="modal-wrapper-container-header">
            {children[0]}
            <button onClick={closeModal}>
              <BiX />
            </button>
          </div>
          <hr />
          <div className="modal-wrapper-container-body" data-testid="modal-body">
            {children[1]}
          </div>
        </div>
        <div className="modal-bg" data-testid='modal-bg'></div>
      </div>
    </>
  );
};

export default ReactionWrapper;

interface IReactionWrapperProps {
  children: React.ReactNode[];
  closeModal: SetState<unknown>;
}
