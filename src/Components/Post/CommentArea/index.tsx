/**
 * This Component is responsible for showing Comment
 */

import React, { useCallback, useEffect, useState } from 'react';
import { FaRegCommentAlt } from 'react-icons/fa';
import '~/Components/Post/CommentArea/CommentArea.scss';
import { IPost } from '~/types/post';
import like from '~/assets/reactions/like.png';
import Reactions from '~/Components/Post/Reactions';
import { AddReactionBody, IReactionPost, ReactionType, SocketReactionResponse } from '~/types/reaction';
import { Utils } from '~/services/utils/utils.service';
import { reactionsMap } from '~/services/utils/static.data';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import { AxiosError, isAxiosError } from 'axios';
import { IError } from '~/types/axios';
import { postService } from '~/services/api/post/post.service';
import useLocalStorage from '~/hooks/useLocalStorage';
import { addReactions } from '~/redux/reducers/post/userReactions.reducer';
import { socketService } from '~/services/socket/sokcet.service';
import { SetState } from '~/types/utils';
const CommentArea = ({ post,setPost }: ICommentAreaProps) => {
  const [userSelectedReaction, setUserSelectedReaction] = useState<string>('');
  const [username] = useLocalStorage('username');
  const { profile } = useSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();

  const { reactions } = useSelector((state: RootState) => state.userReactions);
  const selectedUserReaction = useCallback(
    (postReactions: IReactionPost[]) => {
      const userReaction = postReactions.find((item) => item.postId === post._id);
      const result = userReaction ? Utils.firstLatterUpperCase(userReaction.type) : '';
      setUserSelectedReaction(result);
    },
    [post]
  );

  const getReactions = (newReaction: ReactionType, hasResponse: boolean, prevReaction: ReactionType) => {
    const postReactions = reactions.filter((item) => item.postId !== post._id);
    const newPostReaction: IReactionPost = {
      avatarColor: profile?.avatarColor ?? '',
      createdAt: `${new Date()}`,
      postId: post._id,
      profilePicture: profile?.profilePicture ?? '',
      username: username ?? profile?.username ?? '',
      type: newReaction
    } as IReactionPost;

    if ((hasResponse && newReaction !== prevReaction) || !hasResponse) {
      postReactions.push(newPostReaction);
    }

    return postReactions;
  };

  const updatePostReaction = (newReaction: ReactionType, hasResponse: boolean, prevReaction: ReactionType) => {
    const clonedPost = Utils.cloneDeep(post) as IPost;

    type reactionKeyType = keyof typeof clonedPost.reactions;
    if (!hasResponse) {
      clonedPost.reactions[newReaction as reactionKeyType] += 1;
    } else {
      if (clonedPost.reactions[prevReaction as reactionKeyType] > 0) {
        clonedPost.reactions[prevReaction as reactionKeyType] -= 1;
      }

      if (prevReaction !== newReaction) {
        clonedPost.reactions[newReaction as reactionKeyType] += 1;
      }
    }

    return clonedPost;
  };

  const sendSocketReactions = ({ post, hasResponse, newReaction, prevReaction }: ISendSocketIoResponse) => {
    const socketReactionsData: SocketReactionResponse = {
      userTo: post.userId,
      postId: post._id,
      username: profile?.username ?? username ?? '',
      avatarColor: profile?.avatarColor ?? '',
      type: newReaction,
      postReactions: post.reactions,
      profilePicture: post.profilePicture,
      previousReaction: hasResponse ? prevReaction : ('' as ReactionType)
    };

    socketService.socket.emit('reaction', socketReactionsData);
  };

  const addReactionToPost = async (reaction: string): Promise<void> => {
    /**
     * Things need to check
     * Single Reaction
     * if Same Reaction Click Again Remove it
     * Remove Old Reaction Before Add New One
     * update the Post
     */
    try {
      const reactionResponse = await postService.getPostReactionsByUsername(username ?? profile?.username ?? '', post._id);
      const hasResponse = !!Object.keys(reactionResponse.data.reactions).length;
      const updatedPost = updatePostReaction(reaction as ReactionType, hasResponse, reactionResponse.data.reactions.type as ReactionType);

      const newReactions = getReactions(reaction as ReactionType, hasResponse, reactionResponse.data.reactions.type as ReactionType);
      // post = updatedPost;
      setPost(updatedPost)
      dispatch(addReactions(newReactions));

      sendSocketReactions({
        post,
        hasResponse,
        newReaction: reaction as ReactionType,
        prevReaction: reactionResponse.data.reactions.type as ReactionType
      });

      const reactionsData: AddReactionBody = {
        userTo: post.userId,
        postId: post._id,
        type: reaction as ReactionType,
        postReactions: post.reactions,
        profilePicture: post.profilePicture
      };
      if (!hasResponse) {
        await postService.addReaction(reactionsData);
      } else {
        reactionsData.previousReaction = reactionResponse.data.reactions.type as ReactionType;
        if (reactionsData.previousReaction === reaction) {
          await postService.removeReaction(post._id, reactionsData.previousReaction, reactionsData.postReactions);
        } else {
          await postService.addReaction(reactionsData);
        }
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        const message = typedError?.response?.data?.message || 'Something went wrong';
        Utils.dispatchNotification(message, 'error', dispatch);
      } else {
        Utils.dispatchNotification((error as Error).message || 'Something went wrong', 'error', dispatch);
      }
    }
  };

  useEffect(() => {
    selectedUserReaction(reactions);
  }, [selectedUserReaction, reactions]);
  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div
          className="likes-block"
          onClick={() => {
            addReactionToPost('like');
          }}
        >
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
  setPost: SetState<IPost>;
}

interface ISendSocketIoResponse {
  post: IPost;
  newReaction: ReactionType;
  hasResponse: boolean;
  prevReaction: ReactionType;
}
