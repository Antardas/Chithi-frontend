import React from 'react';
import { IPost } from '~/types/post';
import Avatar from '~/Components/Avatar';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { timeAgo } from '~/services/utils/timeago.utils';
import { feelingsList, privacyList } from '~/services/utils/static.data';
import '~/Components/Post/Post.scss';
import { Utils } from '~/services/utils/utils.service';
import CommentSection from './CommentSection';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import ReactionModal from '~/Components/Post/Reactions/ReactionsModal';

interface IPostProps {
  post: IPost;
  showIcons: boolean;
  loading: boolean;
}
const Post = ({ post, showIcons }: IPostProps) => {
  const { reactionModalIsOpen } = useSelector((state: RootState) => state.modal);
  const getFeeling = (name: string) => {
    const feeling = feelingsList.find((item) => item.name === name);
    return feeling?.name;
  };
  const getPrivacy = (type: string) => {
    const privacy = privacyList.find((item) => item.topText === type);
    return privacy?.icon;
  };
  return (
    <>
      {reactionModalIsOpen ? <ReactionModal /> : null}
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
                    <FaPencilAlt className="pencil" />
                    <FaRegTrashAlt className="trash" />
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
                <div data-testid="post-image" className="image-display-flex">
                  <div className="background">
                    <img className="image" src={Utils.generateImageUrl(post.imgVersion, post.imgId)} alt="" />
                  </div>
                  <img className="post-image" src={Utils.generateImageUrl(post.imgVersion, post.imgId)} alt="" />
                </div>
              )}

              {post?.gifUrl && post.bgColor === '#ffffff' && (
                <div className="image-display-flex">
                  <img className="post-image" src={`${post?.gifUrl}`} alt="" />
                </div>
              )}
              {/* TODO: need to fix it, if any reaction category have reaction */}
              {(Object.values(post?.reactions).filter((count) => count > 0).length || post?.commentCount > 0) && <hr />}
              <CommentSection post={post} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
