import React, { useState } from 'react';
import ReactionWrapper from '~/Components/Post/ModalWrapper/ReactionWrapper';
import '~/Components/Post/Reactions/ReactionsModal/ReactionModal.scss';
import ReactionList from '~/Components/Post/Reactions/ReactionsModal/ReactionList';
import { FormattedReactionCount, PostUtils } from '~/services/utils/post-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { reactionsColor, reactionsMap } from '~/services/utils/static.data';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import { postService } from '~/services/api/post/post.service';
import { IReactionPost, ReactionType } from '~/types/reaction';
import useEffectOnce from '~/hooks/useEffectOnce';
import { closeModal } from '~/redux/reducers/modal/modal.reducer';
import { clearPostItem } from '~/redux/reducers/post/post.reducer';
const ReactionModal = () => {
  const [activeViewAllTab, setActiveViewAllTab] = useState<boolean>(false);
  const [reactionCount, setReactionCount] = useState<FormattedReactionCount[]>([]);
  const [postReactions, setPostReactions] = useState<IReactionPost[]>([]);
  const [postReactionsReadOnly, setPostReactionsReadOnly] = useState<IReactionPost[]>([]);
  const [reactionType, setReactionType] = useState<string>('');
  const [reactionColor, setReactionColor] = useState<string>('');
  const { _id, reactions } = useSelector((state: RootState) => state.post);
  const dispatch = useAppDispatch();
  const getPostReactions = async () => {
    try {
      const response = await postService.getReactionsByPostId(_id); // TODO: instead of again API call we can pass the previous fetched data from the DisplayReactionAndComment -> getPostReactions
      const sortedReaction = response.data.reactions.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1;
        } else if (a.createdAt < b.createdAt) {
          return -1;
        } else {
          return 0;
        }
      });

      setPostReactions(sortedReaction);
      setPostReactionsReadOnly(sortedReaction);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const closeReactionsModal = () => {
    dispatch(closeModal());
    dispatch(clearPostItem());
  };

  const viewAll = () => {
    setActiveViewAllTab(true);
    setReactionType('');
    setPostReactions(postReactionsReadOnly);
  };

  const getReactionsList = (type: ReactionType) => {
    setActiveViewAllTab(false);
    setReactionType(type);
    const exist = postReactionsReadOnly.some((item) => item.type === type);

    const filteredReactions = exist ? postReactionsReadOnly.filter((item) => item.type === type) : [];

    setPostReactions(filteredReactions);
    setReactionColor(reactionsColor[type]);
  };

  useEffectOnce(() => {
    getPostReactions();
    setReactionCount(PostUtils.formatReactionsCount(reactions));
  });
  return (
    <div>
      <ReactionWrapper closeModal={closeReactionsModal}>
        <div className="modal-reactions-header-tabs">
          <ul className="modal-reactions-header-tabs-list">
            <li className={`${activeViewAllTab ? 'activeViewAllTab' : 'all'}`} onClick={viewAll}>
              All
            </li>

            {reactionCount.map((item) => (
              <li
                className={`${item.type === reactionType ? 'activeTab' : null}`}
                key={`modal-reactions-count-${item.type}`}
                style={{
                  color: `${item.type === reactionType ? reactionColor : ''}`
                }}
                onClick={() => getReactionsList(item.type)}
              >
                <img src={`${reactionsMap[item.type]}`} alt="" />

                <span>{PostUtils.shortenLargeNumberReactions(item.value as number)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-reactions-list">
          <ReactionList postReactions={postReactions} />
        </div>
      </ReactionWrapper>
    </div>
  );
};

export default ReactionModal;
