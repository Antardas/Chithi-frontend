import React from 'react';
import Reactions from '~/Components/Post/Reactions';
import { timeAgo } from '~/services/utils/timeago.utils';
import { IMarkMessageAsDeleted, IMessageList, IUpdateMessageReaction } from '~/types/chat';
import { IUser } from '~/types/user';
import doubleCheckMark from '~/assets/images/double-checkmark.png';
import Bubble from './Bubble';
import { reactionsMap } from '~/services/utils/static.data';
const RightSide = ({
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
  lasMessage,
  setImageUrl,
  setShowImageModal,
  showImageModal
}: RightSideProps) => {
  return (
    <div className="message right-message" data-testid="right-message">
      <div className="message-right-reactions-container">
        {toggleReaction && index === activeElementIndex && !message.deleteForEveryone ? (
          <div ref={reactionRef}>
            <Reactions
              showLabel={false}
              onClick={(event) => {
                const body: IUpdateMessageReaction = {
                  type: 'add',
                  conversationId: message.conversationId,
                  messageId: message._id,
                  reaction: event
                };

                handleReaction(body);
                setToggleReaction(false);
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="message-right-content-container-wrapper">
        <div
          data-testid="message-content"
          className="message-content"
          onClick={() => {
            if (!message.deleteForEveryone) {
              deleteMessage(message, 'everyone');
            }
          }}
          onMouseEnter={() => {
            if (!message.deleteForEveryone) {
              showReactionOnHover(true, index);
              setActiveElementIndex(index);
            }
          }}
        >
          {message.deleteForEveryone || (message.deleteForMe && message.receiverProfilePicture === profile.username) ? (
            <div className="message-bubble right-message-bubble">
              <span className="message-deleted">message deleted</span>
            </div>
          ) : null}
          {!message.deleteForEveryone && !message.deleteForMe ? (
            <Bubble message={message} setImageUrl={setImageUrl} setShowImageModal={setShowImageModal} showImageModal={showImageModal} />
          ) : null}
          {!message.deleteForEveryone && message.deleteForMe &&message.senderUsername ===profile.username ? (
            <Bubble message={message} setImageUrl={setImageUrl} setShowImageModal={setShowImageModal} showImageModal={showImageModal} />
          ) : null}
          {/* Message display component Message display component */}
        </div>
        {showReactionIcon && index === activeElementIndex && !message.deleteForEveryone ? (
          <div className="message-content-emoji-right-container" onClick={() => setToggleReaction(true)}>
            &#9786;
          </div>
        ) : null}
      </div>
      <div className="message-content-bottom">
        {message.reaction && message.reaction.length && !message.deleteForEveryone ? (
          <div className="message-reaction">
            {message.reaction.map((data, index) => (
              <img
                data-testid="reaction-img"
                key={`${message._id}-reaction-${data.type}`}
                src={reactionsMap[data.type]}
                alt=""
                onClick={() => {
                  if (data.senderName === profile.username) {
                    const body: IUpdateMessageReaction = {
                      type: 'remove',
                      conversationId: message.conversationId,
                      messageId: message._id,
                      reaction: data.type
                    };

                    handleReaction(body);
                    setSelectedReaction(body);
                  }
                }}
              />
            ))}
          </div>
        ) : null}

        <div className="message-time">
          {message.senderUsername === profile.username && !message.deleteForEveryone ? (
            lasMessage.isRead ? (
              <img src={doubleCheckMark} alt="" className="message-read-icon" />
            ) : message.isRead ? (
              <img src={doubleCheckMark} alt="" className="message-read-icon" />
            ) : null
          ) : null}
          <span data-testid="chat-time">{timeAgo.transform(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default RightSide;

export interface RightSideProps {
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
