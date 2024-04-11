import React from 'react';
import '~/Components/Post/CommentSection/CommentSection.scss';
import { IPost } from '~/types/post';
import CommentArea from '~/Components/Post/CommentArea';
const CommentSection = ({ post }: ICommentSectionProps) => {
  return (
    <div data-testid="comment-section">
      <CommentArea post={post} />
    </div>
  );
};

export default CommentSection;

interface ICommentSectionProps {
  post: IPost;
}
