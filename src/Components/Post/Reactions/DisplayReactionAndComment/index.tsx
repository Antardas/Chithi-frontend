import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import '~/Components/Post/Reactions/DisplayReactionAndComment/DisplayReactionAndComment.scss';
import like from '~/assets/reactions/like.png';
import useEffectOnce from '~/hooks/useEffectOnce';
import { toggleReactionModal } from '~/redux/reducers/modal/modal.reducer';
import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import { RootState, useAppDispatch } from '~/redux/store';
import { postService } from '~/services/api/post/post.service';
import { FormattedReactionCount, PostUtils } from '~/services/utils/post-utils.service';
import { reactionsMap } from '~/services/utils/static.data';
import { Utils } from '~/services/utils/utils.service';
import { IPost } from '~/types/post';
import { IReactionPost } from '~/types/reaction';

function DisplayReactionAndComment({ post }: IDisplayReactionAndCommentProps) {
  const [postReactions, setPostReactions] = useState<IReactionPost[]>([]);
  const [reactions, setReactions] = useState<FormattedReactionCount[]>([]);
  const [loading, setLoading] = useState(false);
  const { reactionModalIsOpen } = useSelector((state: RootState) => state.modal);

  const dispatch = useAppDispatch();

  const sumAllReactions = () => {
    if (reactions.length) {
      const result = reactions.map((item) => item.value as number).reduce((cur, acc) => cur + acc, 0);
      return PostUtils.shortenLargeNumberReactions(result);
    }
  };
  const getPostReactions = async () => {
    setLoading(true);
    try {
      const res = await postService.getReactionsByPostId(post._id);
      setPostReactions(res.data.reactions);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
    setLoading(false);
  };

  const openReactionsModal = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleReactionModal(!reactionModalIsOpen));
  };

  useEffect(() => {
    setReactions(PostUtils.formatReactionsCount(post.reactions));
  }, [post.reactions]);
  return (
    <div className="reactions-display">
      <div className="reaction">
        <div className="likes-block">
          <div className="likes-block-icons reactions-icon-display">
            {reactions.length
              ? reactions.map((item) => (
                  <div className="tooltip-container" key={`reaction-type-${item.type}`}>
                    <img data-testid="reaction-img" className="reaction-img" src={reactionsMap[item.type]} alt="" />
                    <div className="tooltip-container-text tooltip-container-bottom" data-testid="reaction-tooltip">
                      <p className="title">
                        <img className="title-img" src={reactionsMap[item.type]} alt="" />
                        {Utils.firstLatterUpperCase(item.type)}
                      </p>
                      <div className="likes-block-icons-list">
                        {loading ? <FaSpinner className="circle-notch" /> : null}

                        {postReactions.map((reaction) => (
                          <>
                            <div key={reaction._id}>
                              {' '}
                              <span>{reaction.username}</span>
                            </div>
                          </>
                        ))}
                        {postReactions.length > 20 ? <span>and {postReactions.length - 20} others...</span> : null}
                      </div>
                    </div>
                  </div>
                ))
              : null}
            {/* <div className="tooltip-container">
              <img data-testid="reaction-img" className="reaction-img" src={like} alt="" />
              <div className="tooltip-container-text tooltip-container-bottom" data-testid="reaction-tooltip">
                <p className="title">
                  <img className="title-img" src={like} alt="" />
                  Love
                </p>
                <div className="likes-block-icons-list">
                  <FaSpinner className="circle-notch" />
                  <div>
                    <span>Manny</span>
                  </div>
                  <span>and 50 others...</span>
                </div>
              </div>
            </div> */}
          </div>
          <span
            data-testid="reactions-count"
            className="tooltip-container reactions-count"
            onMouseEnter={getPostReactions}
            onClick={() => openReactionsModal()}
          >
            {sumAllReactions()}
            <div className="tooltip-container-text tooltip-container-likes-bottom" data-testid="tooltip-container">
              <div className="likes-block-icons-list">
                {loading ? <FaSpinner className="circle-notch" /> : null}

                {postReactions.map((reaction) => (
                  <>
                    <div key={reaction._id}>
                      {' '}
                      <span>{reaction.username}</span>{' '}
                    </div>
                  </>
                ))}
                {postReactions.length > 20 ? <span>and {postReactions.length - 20} others...</span> : null}
              </div>
            </div>
          </span>
        </div>
      </div>
      <div className="comment tooltip-container" data-testid="comment-container">
        <span data-testid="comment-count">20 Comments</span>
        <div className="tooltip-container-text tooltip-container-comments-bottom" data-testid="comment-tooltip">
          <div className="likes-block-icons-list">
            <FaSpinner className="circle-notch" />
            <div>
              <span>Stan</span>
              <span>and 50 others...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayReactionAndComment;

interface IDisplayReactionAndCommentProps {
  post: IPost;
}
