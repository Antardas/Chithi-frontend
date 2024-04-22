import React, { useEffect, useRef, useState } from 'react';
import { IPost } from '~/types/post';
import Avatar from '~/Components/Avatar';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { timeAgo } from '~/services/utils/timeago.utils';
import { feelingsList, privacyList } from '~/services/utils/static.data';
import '~/Components/Post/Post.scss';
import { Utils } from '~/services/utils/utils.service';
import CommentSection from './CommentSection';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import ReactionModal from '~/Components/Post/Reactions/ReactionsModal';
import useLocalStorage from '~/hooks/useLocalStorage';
import CommentInput from '~/Components/Post/Comments/CommentInput';
import CommentsModal from '~/Components/Post/Comments/CommentsModal';
import ImageModal from '../ImageModal';
import { openModal, toggleDeleteDialog } from '~/redux/reducers/modal/modal.reducer';
import { clearPostItem, updatePostItem } from '~/redux/reducers/post/post.reducer';
import Dialog from '../Dialog';
import { postService } from '~/services/api/post/post.service';

interface IPostProps {
  post: IPost;
  showIcons: boolean;
  loading: boolean;
}
const Post = ({ post: rawPost, showIcons }: IPostProps) => {
  const { reactionModalIsOpen, commentsModalIsOpen, showCommentBox, deleteDialogIsOpen } = useSelector((state: RootState) => state.modal);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const { _id } = useSelector((state: RootState) => state.post);
  const [post, setPost] = useState<IPost>(rawPost);
  const dispatch = useAppDispatch();
  const isRenderedRef = useRef<boolean>(false);
  const getFeeling = (name: string) => {
    const feeling = feelingsList.find((item) => item.name === name);
    return feeling?.image;
  };
  const getPrivacy = (type: string) => {
    const privacy = privacyList.find((item) => item.topText === type);
    return privacy?.icon;
  };

  const openPostEditModal = () => {
    dispatch(openModal({ type: 'edit' }));
    dispatch(updatePostItem(post));
  };
  const openPostDeleteDialogue = () => {
    dispatch(
      toggleDeleteDialog({
        toggle: true,
        data: null
      })
    );
    dispatch(updatePostItem(post));
  };

  const deletePost = async () => {
    try {
      const response = await postService.deletePost(_id);
      if (response) {
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
        dispatch(
          toggleDeleteDialog({
            toggle: false,
            data: null
          })
        );
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffect(() => {
    if (isRenderedRef.current) {
      setPost(rawPost);
    } else {
      isRenderedRef.current = true;
    }
  }, [rawPost]);
  return (
    <>
      {reactionModalIsOpen ? <ReactionModal /> : null}
      {commentsModalIsOpen ? <CommentsModal /> : null}
      {showImageModal ? (
        <ImageModal
          image={imageUrl}
          onCancel={() => {
            setShowImageModal(false);
            setImageUrl('');
          }}
          showArrow={false}
        />
      ) : null}
      {deleteDialogIsOpen ? (
        <Dialog
          key={`post-delete-${post._id}`}
          title="Are you sure you want to delete this post?"
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstBtnHandler={() => {
            deletePost();
          }}
          secondBtnHandler={() => {
            dispatch(
              toggleDeleteDialog({
                toggle: false,
                data: null
              })
            );
            dispatch(clearPostItem());
          }}
        />
      ) : null}
      <div className="post-body" data-testid="post">
        <div className="user-post-data">
          <div className="user-post-data-wrap">
            <div className="user-post-image">
              <Avatar name={post?.username} bgColor={post?.avatarColor} textColor="#ffffff" size={50} avatarSrc={post?.profilePicture} />
            </div>
            <div className="user-post-info">
              <div className="inline-title-display">
                <h5 data-testid="username">
                  {post?.username}
                  {post?.feelings && (
                    <div className="inline-display" data-testid="inline-display">
                      is feeling <img className="feeling-icon" src={`${getFeeling(post.feelings)}`} alt="" /> <div>{post?.feelings}</div>
                    </div>
                  )}
                </h5>
                {showIcons && (
                  <div className="post-icons" data-testid="post-icons">
                    <FaPencilAlt className="pencil" onClick={openPostEditModal} />
                    <FaRegTrashAlt className="trash" onClick={openPostDeleteDialogue} />
                  </div>
                )}
              </div>

              {post?.createAt && (
                <p className="time-text-display" data-testid="time-display">
                  {timeAgo.transform(post?.createAt)} &middot; {getPrivacy(post.privacy)}
                </p>
              )}
            </div>
            <hr />
            <div className="user-post" style={{ marginTop: '1rem', borderBottom: '' }}>
              {post?.post && post?.bgColor === '#ffffff' && (
                <p className="post" data-testid="user-post">
                  {post?.post}
                </p>
              )}
              {post?.post && post?.bgColor !== '#ffffff' && (
                <div data-testid="user-post-with-bg" className="user-post-with-bg" style={{ backgroundColor: `${post?.bgColor}` }}>
                  {post?.post}
                </div>
              )}

              {post?.imgId && post.imgVersion && !post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  onClick={() => {
                    setShowImageModal(true);
                    setImageUrl(Utils.generateImageUrl(post.imgVersion as string, post.imgId as string));
                  }}
                >
                  <div className="background">
                    <img className="image" src={Utils.generateImageUrl(post.imgVersion, post.imgId)} alt="" />
                  </div>
                  <img className="post-image" src={Utils.generateImageUrl(post.imgVersion, post.imgId)} alt="" />
                </div>
              )}

              {post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  className="image-display-flex"
                  onClick={() => {
                    setShowImageModal(true);
                    setImageUrl(post.gifUrl as string);
                  }}
                >
                  <div className="background">
                    <img className="image" src={`${post?.gifUrl}`} alt="" />
                  </div>
                  <img className="post-image" src={`${post?.gifUrl}`} alt="" />
                </div>
              )}
              {/* TODO: need to fix it, if any reaction category have reaction */}
              {(Object.values(post?.reactions).filter((count) => count > 0).length || post?.commentCount > 0) && <hr />}
              <CommentSection post={post} setPost={setPost} key={`post-footer-reactions-${post._id}`} />
            </div>
          </div>

          {/* {selectedPosId === post._id && selectedPosId === _id ? <CommentInput post={post} setPost={setPost} /> : null} */}
          {showCommentBox && post._id === _id ? <CommentInput post={post} setPost={setPost} /> : null}
        </div>
      </div>
    </>
  );
};

export default Post;
