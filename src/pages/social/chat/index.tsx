import React from 'react';
import { useSelector } from 'react-redux';
import ChatList from '~/Components/Chat/List';
import ChatWindow from '~/Components/Chat/Window';
import useEffectOnce from '~/hooks/useEffectOnce';
import '~/pages/social/chat/Chat.scss';
import { getConversationList } from '~/redux/api/chat';
import { RootState, useAppDispatch } from '~/redux/store';
const Chat = () => {
  const { chatList, selectedChatUser } = useSelector((sate: RootState) => sate.chat);
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    dispatch(getConversationList());
  });
  return (
    <>
      <div className="private-chat-wrapper">
        <div className="private-chat-wrapper-content">
          <div className="private-chat-wrapper-content-side">
            <ChatList />
          </div>
          <div className="private-chat-wrapper-content-conversation">
            {selectedChatUser || chatList.length ? <ChatWindow /> : null}
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
