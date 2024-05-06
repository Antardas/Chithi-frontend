import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { IPost } from '~/types/post';
import Avatar from '../Avatar';
import { profile } from 'console';
import { timeAgo } from '~/services/utils/timeago.utils';
import '~/Components/GalleryImage/GalleryImage.scss'
const GalleryImage = ({ imgSrc, onClick, onRemoveImage, post, showCaption, showDelete }: IGalleryImageProps) => {
  return (
    <figure className="gallery-image" onClick={onClick} data-testid="gallery">
      <div className="gallery-image__crop">
        <img className="gallery-image__media" src={imgSrc} alt="" />
        {showDelete ? (
          <div className="gallery-image__delete" onClick={onRemoveImage}>
            <FaTrash />
          </div>
        ) : null}
      </div>
      {showCaption && post ? (
        <figcaption className="gallery-image__caption">
          <div className="figure-header">
            <Avatar name={post.username} bgColor={post.bgColor} textColor={'#ffffff'} size={40} avatarSrc={post.profilePicture} />
            <div className="figure-body">
              <div className="figure-title">{post.username}</div>
              <div className="figure-date">{ timeAgo.transform(post.createAt)}</div>
            </div>
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
};

export default GalleryImage;

export interface IGalleryImageProps {
  post?: IPost;
  showCaption: boolean;
  showDelete: boolean;
  imgSrc: string;
  onClick: () => void;
  onRemoveImage?: (event:React.MouseEvent<HTMLInputElement>) => void;
}
