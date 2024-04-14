import React, { useState } from 'react';
import '~/Components/Post/CommentSection/CommentSection.scss';
import { IPost } from '~/types/post';
import CommentArea from '~/Components/Post/CommentArea';
import DisplayReactionAndComment from '~/Components/Post/Reactions/DisplayReactionAndComment';
const CommentSection = ({ post }: ICommentSectionProps) => {
  const [updatedPost, setUpdatedPost] = useState<IPost>(post);
  return (
    <div data-testid="comment-section">
      <DisplayReactionAndComment post={updatedPost} />
      <CommentArea post={updatedPost} setPost={setUpdatedPost} />
    </div>
  );
};

export default CommentSection;

interface ICommentSectionProps {
  post: IPost;
}
