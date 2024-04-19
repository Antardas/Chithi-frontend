import React, { useState } from 'react';
import '~/Components/Post/CommentSection/CommentSection.scss';
import { IPost } from '~/types/post';
import CommentArea from '~/Components/Post/CommentArea';
import DisplayReactionAndComment from '~/Components/Post/Reactions/DisplayReactionAndComment';
import { SetState } from '~/types/utils';
const CommentSection = ({ post, setPost }: ICommentSectionProps) => {
  // const [updatedPost, setUpdatedPost] = useState<IPost>(post);
  return (
    <div data-testid="comment-section">
      <DisplayReactionAndComment post={post} key={`preview-reactions-and-comment-${post._id}`} />
      <CommentArea post={post} setPost={setPost} />
    </div>
  );
};

export default CommentSection;

interface ICommentSectionProps {
  post: IPost;
  setPost: SetState<IPost>;
}
