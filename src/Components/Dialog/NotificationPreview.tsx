import React from 'react';
import Button from '~/Components/Button';
import { reactionsMap } from '~/services/utils/static.data';
import '~/Components/Dialog/NotificationPreview.scss'

const NotificationPreview = ({ title, post, imgUrl, comment, reaction, senderName, secondButtonText, secondBtnHandler }: NotificationPreviewProps) => {
  return (
    <>
      <div className="notification-preview-container" data-testid="notification-preview">
        <div className="dialog">
          <h4>{title}</h4>
          <div className="dialog-body">
            {post ? <span className="dialog-body-post">{post}</span> : null}
            {imgUrl ? <img className="dialog-body-img" src={imgUrl} alt="" /> : null}
            {comment ? <span className="dialog-body-comment">{comment}</span> : null}
            {reaction ? (
              <div className="dialog-body-reaction" data-testid="reaction">
                <span className="dialog-body-reaction-text">{senderName} reacted on your post with</span>{' '}
                <img className="reaction-img" src={`${reactionsMap[`${reaction}`]}`} alt="" />
              </div>
            ) : null}
          </div>
          <div className="btn-container">
            <Button className="button cancel-btn" label={secondButtonText} handleClick={secondBtnHandler} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPreview;

export interface NotificationPreviewProps {
  post: string;
  imgUrl: string;
  title: string;
  comment: string;
  reaction: string;
  senderName: string;
  secondButtonText: string;
  secondBtnHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
