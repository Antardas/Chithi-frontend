import React from 'react';
import { FaCheck, FaCircle } from 'react-icons/fa';
import doubleCheckMark from '~/assets/images/double-checkmark.png';
import { IMessageList } from '~/types/chat';
import { IUser } from '~/types/user';
const ChatListBody = ({ data, profile }: IProps) => {
  return (
    <div className="conversation-message">
      <span>{data.body}</span>
      {!data.isRead ? (
        <>{data.receiverUsername === profile?.username ? <FaCircle className="icon" /> : <FaCheck className="icon not-read" />}</>
      ) : (
        <>{data.senderUsername === profile?.username && <img src={doubleCheckMark} alt="" className="icon read" />}</>
      )}
    </div>
  );
};

export default ChatListBody;

interface IProps {
  data: IMessageList;
  profile: IUser;
}
