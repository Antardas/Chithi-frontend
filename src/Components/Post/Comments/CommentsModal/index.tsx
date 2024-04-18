import React, { useState } from 'react';
import Avatar from '~/Components/Avatar';
import ReactionWrapper from '~/Components/Post/ModalWrapper/ReactionWrapper';
import '~/Components/Post/Comments/CommentsModal/CommentsModal.scss';
import { RootState, useAppDispatch } from '~/redux/store';
import { IComment } from '~/types/comment';
import { postService } from '~/services/api/post/post.service';
import { Utils } from '~/services/utils/utils.service';
import { useSelector } from 'react-redux';
import useEffectOnce from '~/hooks/useEffectOnce';
import { closeModal } from '~/redux/reducers/modal/modal.reducer';
import { clearPostItem } from '~/redux/reducers/post/post.reducer';
const CommentsModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const { _id } = useSelector((state: RootState) => state.post);
  const dispatch = useAppDispatch();
  const getComments = async () => {
    setLoading(true);
    try {
      const res = await postService.getPostComments(_id);
      setComments(res.data.comments);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
    setLoading(false);
  };

  const closeCommentsModal = () => {
    dispatch(closeModal());
    dispatch(clearPostItem());
  };
  useEffectOnce(() => {
    getComments();
  });
  return (
    <ReactionWrapper closeModal={closeCommentsModal}>
      <div className="modal-comments-header">
        <h2>Comments</h2>
      </div>

      <div className="modal-comments-container">
        <ul className="modal-comments-container-list">
          {comments.map((data) => (
            <li className="modal-comments-container-list-item" key={data?._id} data-testid="modal-list-item">
              <div className="modal-comments-container-list-item-display">
                <div className="user-img">
                  <Avatar name={data?.username} bgColor={data?.avatarColor} textColor="#ffffff" size={45} avatarSrc={data?.profilePicture} />
                </div>
                <div className="modal-comments-container-list-item-display-block">
                  <div className="comment-data">
                    <h1>{data?.username}</h1>
                    <p>{data?.comment}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ReactionWrapper>
  );
};

export default CommentsModal;
