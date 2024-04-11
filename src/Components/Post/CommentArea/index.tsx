/**
 * This Component is responsible for showing Comment
 */

import React from 'react';
import { FaRegCommentAlt } from 'react-icons/fa';
import '~/Components/Post/CommentArea/CommentArea.scss';
import { IPost } from '~/types/post';
import like from '~/assets/reactions/like.png';
const CommentArea = ({ post }: ICommentAreaProps) => {
  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div className="likes-block">
          <div className="like likes-block-icons reaction-icon">
            <div className="reaction-display like" data-testid="selected-reaction">
              <img className="reaction-img" src={like} alt="" />
              <span>Like</span>
            </div>
            {/* <div className="reaction-display" data-testid="default-reaction">
                    <img className="reaction-img" src="" alt="" /> <span>Like</span>
                  </div> */}
          </div>
        </div>
        <div className="reactions-container app-reactions">Reactions</div>
      </div>
      <div className="comment-block">
        <span className="comments-text">
          <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
        </span>
      </div>
    </div>
  );
};

export default CommentArea;

interface ICommentAreaProps {
  post: IPost;
}
