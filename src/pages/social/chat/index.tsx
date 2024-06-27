import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBeforeUnload, useBlocker, useSearchParams } from 'react-router-dom';
import ChatList from '~/Components/Chat/List';
import ChatWindow from '~/Components/Chat/Window';
import useEffectOnce from '~/hooks/useEffectOnce';
import '~/pages/social/chat/Chat.scss';
import { getConversationList } from '~/redux/api/chat';
import { RootState, useAppDispatch } from '~/redux/store';
import router from '~/routes';
import { chatService } from '~/services/api/chat/chat.service';
import { ChatUtils } from '~/services/utils/chat-utils.service';
const Chat = () => {
  const { conversations, selectedChatUser } = useSelector((sate: RootState) => sate.chat);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffectOnce(() => {
    dispatch(getConversationList());
  });

  useEffect(() => {
    console.log(`🚀 ~ useEffect ~ chatUsers:`, ChatUtils.chatUsers);

  }, [ChatUtils.chatUsers]);



  // Return False Meaning it won't block the navigation
  useBlocker(({ nextLocation }) => {
    if (nextLocation.pathname.includes('chat')) {
      return false;
    }
    const paramsUsername = searchParams.get('username');
    const existingUser = ChatUtils.chatUsers.find((chat) => chat.sender === paramsUsername || chat.receiver === paramsUsername);
    if (existingUser) {
      chatService.removeChatUser(existingUser);
    }
    return false;
  });

  return (
    <>
      <div className="private-chat-wrapper">
        <div className="private-chat-wrapper-content">
          <div className="private-chat-wrapper-content-side">
            <ChatList />
          </div>
          <div className="private-chat-wrapper-content-conversation">
            {selectedChatUser || conversations.length ? <ChatWindow /> : null}
            {!selectedChatUser && !conversations.length ? (
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
