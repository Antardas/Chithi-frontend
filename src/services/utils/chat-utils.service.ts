import { SetState } from '~/types/utils';
import { socketService } from '../socket/sokcet.service';
import { ISearchUser, IUser } from '~/types/user';
import { IConversationUsers, IMessageList, ISendMessageBody, ISenderReceiver, ISocketMessageReaction } from '~/types/chat';
import { AppDispatch, RootState, store } from '~/redux/store';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { createSearchParams, NavigateFunction } from 'react-router-dom';
import { chatService } from '../api/chat/chat.service';
import { Utils } from './utils.service';
import { addOnlineUsers, setConversationId, setConversations, setSelectedChatMessages } from '~/redux/reducers/chat/chat.reducer';

export class ChatUtils {
  static privateChatMessages: IMessageList[] = [];
  static chatUsers: IConversationUsers[] = [];

  static usersOnline() {
    socketService.socket?.on('USER_ONLINE', (data: string[]) => {
      // setOnlineUsers(data);
      store.dispatch(addOnlineUsers(data));
    });
  }
  static usersOnChatPage() {
    socketService.socket?.on('ADD_MESSAGE_USER', (data: IConversationUsers[]) => {
      ChatUtils.chatUsers = data;
    });
    socketService.socket?.on('REMOVE_MESSAGE_USER', (data: IConversationUsers[]) => {
      ChatUtils.chatUsers = data;
    });
  }
  static joinRoomEvent(user: ISenderReceiver, profile: IUser) {
    const users: ISenderReceiver = {
      receiverId: user.receiverId,
      receiverName: user.receiverName,
      senderId: profile._id,
      senderName: profile.username as string
    };

    socketService.socket?.emit('JOIN_ROOM', users);
  }

  static chatPageEmitEvent(event: string, data: unknown) {
    socketService.socket?.emit(event, data);
  }

  static chatUrlParams(user: ISenderReceiver, profile: IUser) {
    const params = {
      username: '',
      id: ''
    };

    if (user.receiverName === profile.username) {
      params.username = user.senderName;
      params.id = user.senderId;
    } else {
      params.username = user.receiverName;
      params.id = user.receiverId;
    }

    return params;
  }

  static messageData({ receiver, message, searchParamsId, conversationId, chatList, isRead, gifUrl, selectedImage }: IMessageDataParams) {
    const chatConversationId = chatList.find(
      (chatConversation) => chatConversation.receiverId === searchParamsId || chatConversation.senderId === searchParamsId
    );

    const messageData: ISendMessageBody = {
      conversationId: chatConversationId ? chatConversationId.conversationId : conversationId,
      receiverId: receiver._id,
      receiverUsername: receiver.username as string,
      receiverAvatarColor: receiver?.avatarColor as string,
      receiverProfilePicture: receiver?.profilePicture,
      body: message.trim(),
      gifUrl: gifUrl ?? '',
      selectedImage: selectedImage ?? '',
      isRead
    };

    return messageData;
  }

  static updateSelectedUser({
    chatMessageList,
    dispatch,
    navigate,
    params,
    pathname,
    profile,
    setSelectedChatUser,
    username
  }: IUpdateSelectedUserParams) {
    if (chatMessageList && chatMessageList.length) {
      dispatch(setSelectedChatUser({ isLoading: false, user: chatMessageList[0] }));
      navigate(`${pathname}?${createSearchParams(params)}`);
    } else {
      dispatch(setSelectedChatUser({ isLoading: false, user: null }));

      const sender = ChatUtils.chatUsers.find(
        (chatUser) => chatUser.sender.toLowerCase() === profile.username?.toLowerCase() && chatUser.receiver === username
      );

      if (sender) {
        chatService.removeChatUser(sender);
      }
    }
  }

  static socketIOChatList() {
    socketService.socket?.on('CHAT_LIST', (data: IMessageList) => {
      const profile = store.getState().user.profile;

      if (!profile) {
        return null;
      }

      const chatMessageList = store.getState().chat.conversations;
      if (data.senderUsername === profile.username || data.receiverUsername === profile.username) {
        let messageIndex = chatMessageList.findIndex((message) => message.conversationId === data.conversationId);

        const clonedChatMessageList = Utils.cloneDeep(chatMessageList) as IMessageList[];

        if (messageIndex !== -1) {
          clonedChatMessageList.splice(messageIndex, 1);
          clonedChatMessageList.unshift(data);
        } else {
          messageIndex = chatMessageList.findIndex((message) => message.receiverUsername === data.receiverUsername);
          clonedChatMessageList.splice(messageIndex, 1, data);
        }
        store.dispatch(setConversations(clonedChatMessageList));
      }
    });
  }

  static addReceivedMessageToChat(data: IMessageList) {
    const username = store.getState().chat.conversationUsername;
    if (!username) {
      return;
    }
    if (data.senderUsername.toLowerCase() === username.toLowerCase() || data.receiverUsername.toLowerCase() === username.toLowerCase()) {
      store.dispatch(setConversationId(data.conversationId));
      ChatUtils.privateChatMessages.push(data);
      store.dispatch(setSelectedChatMessages([...ChatUtils.privateChatMessages]));
    }
  }

  static markMassageIsReadToChat(data: IMessageList) {
    let username = store.getState().chat.conversationUsername;
    if (!username) {
      return;
		}
		username = username.toLowerCase()

    if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
      const messageIndex = ChatUtils.privateChatMessages.findIndex((message) => message._id === data._id);

      if (messageIndex !== -1) {
        ChatUtils.privateChatMessages.splice(messageIndex, 1, data);
        store.dispatch(setSelectedChatMessages([...ChatUtils.privateChatMessages]));
      }
    }
  }

  static socketIOMessageReceived() {
    // const clonedChatMessages = Utils.cloneDeep(chatMessages) as IMessageList[];
    socketService.socket?.on('MESSAGE_RECEIVED', ChatUtils.addReceivedMessageToChat);

    socketService.socket.on('MESSAGE_READ', ChatUtils.markMassageIsReadToChat);
  }

  static socketIOnMessageReaction({ setChatMessages, username }: ISocketMessageReaction) {
    socketService.socket?.on('ADDED_REACTION', (data: IMessageList) => {
      const chatMessages = store.getState().chat.selectedChatMessages;
      const clonedChatMessages = Utils.cloneDeep(chatMessages) as IMessageList[];
      if (data.senderUsername.toLowerCase() === username.toLowerCase() || data.receiverUsername.toLowerCase() === username.toLowerCase()) {
        // setConversationId(data.conversationId);

        const messageIndex = clonedChatMessages.findIndex((message) => message._id === data._id);

        if (messageIndex !== -1) {
          clonedChatMessages.splice(messageIndex, 1, data);
          ChatUtils.privateChatMessages.splice(messageIndex, 1, data);
          setChatMessages(clonedChatMessages);
        }
      }
    });
  }

  static getSenderAndReceiverObj(profile: IUser, user: ISearchUser): ISenderReceiver {
    return {
      senderId: profile._id,
      receiverId: user._id,
      senderName: profile.username as string,
      receiverName: user.username as string
    };
  }
}

interface IUpdateSelectedUserParams {
  chatMessageList: IMessageList[];
  profile: IUser;
  username: string;
  setSelectedChatUser: ActionCreatorWithPayload<{
    isLoading: boolean;
    user: IMessageList | null;
  }>;
  params: {
    username: string;
    id: string;
  };
  pathname: string;
  navigate: (path: string) => void | NavigateFunction;
  dispatch: AppDispatch;
}

export interface IMessageDataParams {
  receiver: ISearchUser | IUser;
  message: string;
  searchParamsId: string;
  conversationId: string;
  chatList: IMessageList[];
  isRead: boolean;
  gifUrl: string;
  selectedImage: string;
}

interface ISocketIOChatListParams {
  profile: IUser;
  chatMessageList: IMessageList[];
  setChatMessageList: SetState<IMessageList[]>;
}

interface ISocketIOMessageReceived {
  chatMessages?: IMessageList[];
  username: string;
  setConversationId?: SetState<string>;
  setChatMessages?: (messages: IMessageList[]) => void;
}
