import React from 'react';
import { useSelector } from 'react-redux';
import ChatList from '~/Components/Chat/List';
import '~/pages/social/chat/Chat.scss';
import { RootState } from '~/redux/store';
const Chat = () => {
  const { chatList, selectedChatUser } = useSelector((sate: RootState) => sate.chat);
  return (
    <>
      <div className="private-chat-wrapper">
        <div className="private-chat-wrapper-content">
          <div className="private-chat-wrapper-content-side">
            <ChatList />
          </div>
          <div className="private-chat-wrapper-content-conversation">
            {selectedChatUser && chatList.length ? <div>Chat Window</div> : null}
            {!selectedChatUser && !chatList.length ? (
              <div className="no-chat" data-testid="no-chat">
                Select or Search for users to chat with
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
