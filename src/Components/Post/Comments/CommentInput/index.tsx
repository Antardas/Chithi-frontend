import React, { useEffect, useRef, useState } from 'react';
import Input from '~/Components/Input';
import { IPost } from '~/types/post';
import '~/Components/Post/Comments/CommentInput/CommentInput.scss';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import { Utils } from '~/services/utils/utils.service';
import { postService } from '~/services/api/post/post.service';
import { SetState } from '~/types/utils';
import { socketService } from '~/services/socket/sokcet.service';
const CommentInput = ({ post, setPost }: Props) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState<string>('');
  const commentInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const submitComment = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const clonedPost = Utils.cloneDeep(post) as IPost;
      clonedPost.commentCount += 1;
      const commentBody = {
        comment: comment.trim(),
        postId: post._id,
        userTo: post._id,
        profilePicture: profile?.profilePicture,
        commentsCount: clonedPost.commentCount
      };
      setPost(clonedPost);

      socketService.socket.emit('comment', commentBody);
      const response = await postService.addComment(commentBody);
      setComment('');
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, []);
  return (
    <div className="comment-container" data-testid="comment-input">
      <form className="comment-form" onSubmit={submitComment}>
        <Input
          ref={commentInputRef}
          name="comment"
          type="text"
          value={comment}
          labelText=""
          className="comment-input"
          placeholder="Write a comment..."
          onChange={(event) => setComment(event.target.value)}
          id="comment-input"
        />
      </form>
    </div>
  );
};

export default CommentInput;

interface Props {
  post: IPost;
  setPost: SetState<IPost>;
}
