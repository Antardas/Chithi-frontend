import React from 'react';
import Reactions from '~/Components/Post/Reactions';
import { timeAgo } from '~/services/utils/timeago.utils';
import { IMessageList, IUpdateMessageReaction } from '~/types/chat';
import { IUser } from '~/types/user';
import { reactionsMap } from '~/services/utils/static.data';
import Avatar from '~/Components/Avatar';

const LeftSide = ({
  deleteMessage,
  activeElementIndex,
  index,
  toggleReaction,
  reactionRef,
  handleReaction,
  message,
  profile,
  setToggleReaction,
  setActiveElementIndex,
  showReactionOnHover,
  showReactionIcon,
  setSelectedReaction,
  setImageUrl,
  setShowImageModal,
  showImageModal
}: LeftSideProps) => {
  return (
    <div className="message left-message" data-testid="left-message">
      <div className="message-reactions-container">
        {toggleReaction && index === activeElementIndex ? (
          <div ref={reactionRef}>
            <Reactions
              showLabel={false}
              onClick={(event) => {
                const body: IUpdateMessageReaction = {
                  conversationId: message?.conversationId,
                  messageId: message._id,
                  reaction: event,
                  type: 'add'
                };
                handleReaction(body);
                setToggleReaction(false);
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="left-message-bubble-container">
        <div className="message-img">
          <Avatar
            name={message.senderUsername}
            bgColor={message.senderAvatarColor}
            textColor="#ffffff"
            size={40}
            avatarSrc={message.senderProfilePicture}
          />
        </div>
        <div className="message-content-container">
          <div className="message-content-container-wrapper">
            <div
              className="message-content"
              onClick={() => {
                if (!message?.deleteForMe) {
                  deleteMessage(message, 'me');
                }
              }}
              onMouseEnter={() => {
                if (!message?.deleteForMe) {
                  showReactionOnHover(true, index);
                  setActiveElementIndex(index);
                }
              }}
            >
              {message?.deleteForMe && message?.receiverUsername === profile?.username && (
                <div className="message-bubble left-message-bubble">
                  <span className="message-deleted">message deleted</span>
                </div>
              )}

              {!message?.deleteForMe && (
                <>
                  {message?.body !== 'Sent a GIF' && message?.body !== 'Sent an Image' && (
                    <div className="message-bubble left-message-bubble">{message?.body}</div>
                  )}
                  {message?.selectedImage && (
                    <div
                      className="message-image"
                      style={{
                        marginTop: `${message?.body && message?.body !== 'Sent an Image' ? '5px' : ''}`
                      }}
                    >
                      <img
                        src={message?.selectedImage}
                        onClick={() => {
                          setImageUrl(message?.selectedImage);
                          setShowImageModal(!showImageModal);
                        }}
                        alt=""
                      />
                    </div>
                  )}
                  {message?.gifUrl && (
                    <div className="message-gif">
                      <img src={message?.gifUrl} alt="" />
                    </div>
                  )}
                </>
              )}
            </div>
            {showReactionIcon && index === activeElementIndex && !message?.deleteForMe && (
              <div className="message-content-emoji-container" onClick={() => setToggleReaction(true)}>
                &#9786;
              </div>
            )}
          </div>
          {message?.reaction && message.reaction.length > 0 && !message?.deleteForMe && (
            <div className="message-reaction">
              {message?.reaction.map((data, index) => (
                <img
                  src={reactionsMap[data?.type]}
                  alt=""
                  key={index}
                  onClick={() => {
                    if (data?.senderName === profile?.username) {
                      const body: IUpdateMessageReaction = {
                        conversationId: message?.conversationId,
                        messageId: message?._id,
                        reaction: data?.type,
                        type: 'remove'
                      };
                      setSelectedReaction(body);
                    }
                  }}
                />
              ))}
            </div>
          )}
          <div className="message-time">
            <span data-testid="chat-time">{timeAgo.timeFormat(message?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;

interface LeftSideProps {
  message: IMessageList;
  lasMessage: IMessageList;
  profile: IUser;
  handleReaction: (body: IUpdateMessageReaction) => void;
  deleteMessage: (message: IMessageList, type: 'me' | 'everyone') => void;
  setToggleReaction: (mode: boolean) => void;
  toggleReaction: boolean;
  showReactionIcon: boolean;
  reactionRef: React.RefObject<HTMLDivElement>;
  index: number;
  activeElementIndex: number;
  showReactionOnHover: (show: boolean, index: number) => void;
  setActiveElementIndex: (index: number) => void;
  setSelectedReaction: (body: IUpdateMessageReaction) => void;
  setShowImageModal: (show: boolean) => void;
  setImageUrl: (body: string) => void;
  showImageModal: boolean;
}
