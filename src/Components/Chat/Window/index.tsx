import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '~/Components/Avatar';
import { RootState, useAppDispatch } from '~/redux/store';
import { Utils } from '~/services/utils/utils.service';
import { IUser } from '~/types/user';
import '~/Components/Chat/Window/ChatWindow.scss';
import MessageInput from './MessageInput';
import { useSearchParams } from 'react-router-dom';
import { userService } from '~/services/api/user/user.service';
import { ChatUtils } from '~/services/utils/chat-utils.service';
import useEffectOnce from '~/hooks/useEffectOnce';
import { chatService } from '~/services/api/chat/chat.service';
import { IMarkMessageAsDeleted, IMessageList, ISendMessageBody, IUpdateMessageReaction } from '~/types/chat';
import MessageDisplay from './MessageDisplay';
import { socketService } from '~/services/socket/sokcet.service';
import { setConversationUsername, setSelectedChatMessages } from '~/redux/reducers/chat/chat.reducer';

const ChatWindow = () => {
  const { isLoading, onlineUsers } = useSelector((state: RootState) => state.chat);
  const { profile } = useSelector((state: RootState) => state.user);
  const { selectedChatMessages: chatMessages } = useSelector((state: RootState) => state.chat);
  const [receiver, setReceiver] = useState<IUser | null>(null);
  // const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [searchparams] = useSearchParams();
  const dispatch = useAppDispatch();
  const isRendered = useRef(false);
  const setChatMessages = useCallback(
    (messages: IMessageList[]) => {
      dispatch(setSelectedChatMessages(messages));
    },
    [dispatch]
  );
  const sendMessage = async ({ gifUrl, image, message }: ISendMessageParam) => {
    try {
      const isSenderInChatPage = ChatUtils.chatUsers.some((user) => user.sender === profile?.username && user.receiver === receiver?.username);
      const isReceiverInChatPage = ChatUtils.chatUsers.some((user) => user.sender === receiver?.username && user.receiver === profile?.username);

      const searchParamsId = searchparams.get('id');
      if (!receiver || !searchParamsId) {
        return;
      }

      const body = ChatUtils.messageData({
        chatList: chatMessages,
        conversationId,
        gifUrl,
        message,
        receiver,
        searchParamsId: searchParamsId,
        selectedImage: image,
        isRead: isSenderInChatPage && isReceiverInChatPage
      });

      await chatService.sendChatMessage(body);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const getChatMessages = useCallback(async (receiverId: string) => {
    try {
      const result = await chatService.getChatMessages(receiverId);
      ChatUtils.privateChatMessages = [...result.data.data];
      setChatMessages(result.data.data);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  }, []);

  const getUserProfileById = useCallback(async () => {
    try {
      const receiverId = searchparams.get('id');
      if (!receiverId) {
        return;
      }
      const response = await userService.getUserById(receiverId);
      const user = response.data.data;
      setReceiver(user);
      const formattedUser = ChatUtils.getSenderAndReceiverObj(profile as IUser, {
        _id: user._id,
        avatarColor: user?.avatarColor as string,
        email: user?.email as string,
        profilePicture: user.profilePicture,
        username: user?.username as string
      });
      ChatUtils.joinRoomEvent(formattedUser, profile as IUser);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  }, [dispatch, profile, searchparams]);

  const getNewUserMessages = useCallback(async () => {
    try {
      const username = searchparams.get('username');
      const receiverId = searchparams.get('id');
      if (receiverId && username) {
        setConversationId('');
        setChatMessages([]);
        getChatMessages(receiverId);
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  }, [getChatMessages, dispatch, searchparams]);

  const updateMessageReaction = async (body: IUpdateMessageReaction) => {
    try {
      await chatService.updateMessageReaction(body);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  const deleteChatMessage = async (params: IMarkMessageAsDeleted) => {
    try {
      await chatService.markMessageAsDeleted(params);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
      getUserProfileById();
      getNewUserMessages();
    }
    return () => {
      isRendered.current = false;
    };
  }, [searchparams, getNewUserMessages, getUserProfileById]);

  useEffect(() => {
    const username = searchparams.get('username');
    dispatch(setConversationUsername(username));
    if (username) {
      ChatUtils.socketIOMessageReceived();
      ChatUtils.usersOnline();
      ChatUtils.usersOnChatPage();
    }

    return () => {
      dispatch(setConversationUsername('')); // NOTE: maybe we don't need it
      socketService.socket?.off('MESSAGE_RECEIVED', ChatUtils.addReceivedMessageToChat);
      socketService.socket?.off('MESSAGE_READ', ChatUtils.markMassageIsReadToChat);
    };
  }, [searchparams, dispatch]);
  useEffect(() => {
    const username = searchparams.get('username');
    if (username) {
      ChatUtils.socketIOnMessageReaction({ setChatMessages, username });
    }
    return () => {
      socketService.socket.off('ADDED_REACTION');
    };
  }, [searchparams]);

  return (
    <div className="chat-window-container" data-testid="chatWindowContainer">
      {isLoading ? (
        <div className="message-loading" data-testid="message-loading"></div>
      ) : (
        <div data-testid="chatWindow">
          <div className="chat-title" data-testid="chat-title">
            {receiver && receiver?.username && (
              <>
                <div className="chat-title-avatar">
                  <Avatar name={receiver.username} bgColor={receiver.avatarColor} textColor="#ffffff" size={40} avatarSrc={receiver.profilePicture} />
                </div>
                <div className="chat-title-items">
                  <div className={`chat-name ${Utils.checkIfUserIsOnline(receiver.username, onlineUsers) ? '' : 'user-not-online'}`}>
                    {receiver.username}
                  </div>
                  {Utils.checkIfUserIsOnline(receiver.username, onlineUsers) && <span className="chat-active">Online</span>}
                </div>
              </>
            )}
          </div>
          <div className="chat-window">
            <div className="chat-window-message">
              <MessageDisplay
                chatMessages={chatMessages}
                profile={profile as IUser}
                updateMessageReaction={updateMessageReaction}
                deleteChatMessage={deleteChatMessage}
              />
            </div>
            <div className="chat-window-input">
              <MessageInput setChatMessage={sendMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;

interface ISendMessageParam {
  message: string;
  gifUrl: string;
  image: string;
}
