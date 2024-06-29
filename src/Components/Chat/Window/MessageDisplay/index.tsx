import React, { useRef, useState } from 'react';
import { IMarkMessageAsDeleted, IMessageList, IUpdateMessageReaction } from '~/types/chat';
import { IUser } from '~/types/user';
import '~/Components/Chat/Window/MessageDisplay/MessageDisplay.scss';
import { timeAgo } from '~/services/utils/timeago.utils';
import RightSide from './RightSide';
import useDetectOutsideClick from '~/hooks/useDetectOutsideClick';
import useChatScrollToBottom from '~/hooks/useChatScrollToBottom';
import ImageModal from '~/Components/ImageModal';
import Dialog from '~/Components/Dialog';
import LeftSide from './LeftSide';
type DeleteType = 'me' | 'everyone';
interface DeleteDialogType {
  open: boolean;
  message: IMessageList | null;
  type: 'me' | 'everyone' | '';
}
const MessageDisplay = ({ chatMessages, deleteChatMessage, profile, updateMessageReaction }: IMessageDisplayProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showReactionIcon, setShowReactionIcon] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogType>({
    open: false,
    message: null,
    type: ''
  });
  const [activeElementIndex, setActiveElementIndex] = useState<number>(-1);
  const [selectedReaction, setSelectedReaction] = useState<IUpdateMessageReaction | null>(null);
  const reactionRef = useRef(null);
  const [toggleReaction, setToggleReaction] = useDetectOutsideClick(reactionRef, false);
  const scrollRef = useChatScrollToBottom(chatMessages);

  const handleReactionClick = (body: IUpdateMessageReaction) => {
    updateMessageReaction(body);
    setSelectedReaction(null);
  };

  const showReactionIconOnHover = (show: boolean, index: number) => {
    if (index === activeElementIndex || !activeElementIndex) {
      setShowReactionIcon(show);
    }
  };

  const deleteMessage = (message: IMessageList, type: 'me' | 'everyone') => {
    setDeleteDialog({
      open: true,
      message,
      type
    });
  };

  const renderDateGroup = (message: IMessageList, index: number) => {
    if (index === 0 || timeAgo.dayMonthYear(message.createdAt) !== timeAgo.dayMonthYear(chatMessages[index - 1].createdAt)) {
      return (
        <div className="message-date-group">
          <div className="message-chat-date" data-testid="message-chat-date">
            {timeAgo.chatMessageTransform(message.createdAt)}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderMessageSide = (message: IMessageList, index: number) => {
    const commonProps = {
      message,
      lasMessage: chatMessages[chatMessages.length - 1],
      profile,
      index,
      activeElementIndex,
      setActiveElementIndex,
      deleteMessage,
      handleReaction: handleReactionClick,
      reactionRef,
      setImageUrl,
      setSelectedReaction,
      setShowImageModal,
      showImageModal,
      showReactionOnHover: showReactionIconOnHover,
      showReactionIcon,
      setToggleReaction,
      toggleReaction
    };

    if (message.senderUsername === profile.username) {
      return <RightSide {...commonProps} />;
    } else if (message.receiverUsername === profile.username) {
      return <LeftSide {...commonProps} />;
    }
    return null;
  };

  return (
    <>
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
      {selectedReaction ? (
        <Dialog
          title="Do ou want to remove the reaction"
          firstButtonText="Remove"
          secondButtonText="Cancel"
          firstBtnHandler={() => {
            handleReactionClick(selectedReaction);
          }}
          secondBtnHandler={() => {
            setSelectedReaction(null);
          }}
        />
      ) : null}
      {deleteDialog.open && deleteDialog.type ? (
        <Dialog
          title="Delete Message"
          firstButtonText={`${deleteDialog.type === 'me' ? 'Delete For Me' : 'Delete For Everyone'}`}
          secondButtonText="Cancel"
          firstBtnHandler={() => {
            const { message, type } = deleteDialog;
            if (!type || !message) {
              return;
            }
            deleteChatMessage({
              messageId: message._id,
              type: type,
              senderId: message.senderId,
              receiverId: message.receiverId
            });
            setDeleteDialog({
              open: false,
              message: null,
              type: ''
            });
          }}
          secondBtnHandler={() => {
            setDeleteDialog({
              open: false,
              message: null,
              type: ''
            });
          }}
        />
      ) : null}

      <div className="message-page" ref={scrollRef} data-testid="message-page">
        {chatMessages.map((message, index) => (
          <div className="message-chat" data-testid="message-chat" key={`message-${message._id}${index}`}>
            {renderDateGroup(message, index)}
            {renderMessageSide(message, index)}
          </div>
        ))}
      </div>
    </>
  );
};

export default MessageDisplay;

export interface IMessageDisplayProps {
  chatMessages: IMessageList[];
  profile: IUser;
  updateMessageReaction: (body: IUpdateMessageReaction) => void;
  deleteChatMessage: (params: IMarkMessageAsDeleted) => void;
}
