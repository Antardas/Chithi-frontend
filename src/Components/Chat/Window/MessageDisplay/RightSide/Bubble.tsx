import React from 'react';
import { IMessageList } from '~/types/chat';

const Bubble = ({ message, setImageUrl, setShowImageModal, showImageModal }: BubbleProps) => {
  return (
    <div>
      {message.body !== 'Sent a GIF' && message.body !== 'Sent an Image' ? (
        <div className="message-bubble right-message-bubble">{message.body}</div>
      ) : null}

      {message?.selectedImage ? (
        <div className="message-image" style={{ marginTop: `${message?.body && message?.body !== 'Sent an Image' ? '5px' : ''}` }}>
          <img
            src={message?.selectedImage}
            onClick={() => {
              setImageUrl(message?.selectedImage);
              setShowImageModal(!showImageModal);
            }}
            alt=""
          />
        </div>
      ) : null}

      {message?.gifUrl && (
        <div className="message-gif">
          <img
            src={message?.gifUrl}
            onClick={() => {
              setImageUrl(message?.gifUrl);
              setShowImageModal(!showImageModal);
            }}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default Bubble;

export interface BubbleProps {
  message: IMessageList;
  showImageModal: boolean;
  setImageUrl: (url: string) => void;
  setShowImageModal: (show: boolean) => void;
}
