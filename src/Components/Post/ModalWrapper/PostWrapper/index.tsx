
import React from 'react';
import '~/Components/Post/ModalWrapper/PostWrapper/PostWrapper.scss';

interface IPostWrapperProps {
  children: React.ReactNode[];
}
const PostWrapper = ({ children }: IPostWrapperProps) => {
  return (
    <div className="modal-wrapper" data-testid="post-modal">
      {children[1]}
      {children[2]}
      {children[3]}

      <div className="modal-bg"></div>
    </div>
  );
};

export default PostWrapper;
