/**
 * This Component is responsible for showing Comment
 */

import React, { useCallback, useEffect, useState } from 'react';
import { FaRegCommentAlt } from 'react-icons/fa';
import '~/Components/Post/CommentArea/CommentArea.scss';
import { IPost } from '~/types/post';
import like from '~/assets/reactions/like.png';
import Reactions from '~/Components/Post/Reactions';
import { IReactionPost } from '~/types/reaction';
import { Utils } from '~/services/utils/utils.service';
import { reactionsMap } from '~/services/utils/static.data';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
const CommentArea = ({ post }: ICommentAreaProps) => {
  const [userSelectedReaction, setUserSelectedReaction] = useState<string>('');
  // const reactions: IReactionPost[] = [];
  const { reactions } = useSelector((state: RootState) => state.userReactions);
  const selectedUserReaction = useCallback(
    (postReactions: IReactionPost[]) => {
      const userReaction = postReactions.find((item) => item.postId === post._id);
      const result = userReaction ? Utils.firstLatterUpperCase(userReaction.type) : '';
      setUserSelectedReaction(result);
    },
    [post]
  );

  const addReactionToPost = async (reaction: string): Promise<void> => {};

  useEffect(() => {
    selectedUserReaction(reactions);
  }, [selectedUserReaction, reactions]);
  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div className="likes-block">
          <div className={`likes-block-icons reaction-icon ${userSelectedReaction.toLowerCase()}`}>
            {userSelectedReaction ? (
              <div className={`reaction-display ${userSelectedReaction.toLowerCase()}`} data-testid="selected-reaction">
                <img className="reaction-img" src={reactionsMap[userSelectedReaction.toLowerCase()]} alt="" />
                <span>{userSelectedReaction}</span>
              </div>
            ) : (
              <div className="reaction-display" data-testid="default-reaction">
                <img className="reaction-img" src={like} alt="" /> <span>Like</span>
              </div>
            )}
          </div>
        </div>
        <div className="reactions-container app-reactions">
          <Reactions onClick={addReactionToPost} />
        </div>
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
