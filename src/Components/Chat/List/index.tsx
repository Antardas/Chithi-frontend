import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Avatar from '~/Components/Avatar';
import '~/Components/Chat/List/ChatList.scss';
import Input from '~/Components/Input';
import { RootState, useAppDispatch } from '~/redux/store';
import SearchList from '../Search';
import { ISearchUser, IUser } from '~/types/user';
import { Utils } from '~/services/utils/utils.service';
import { userService } from '~/services/api/user/user.service';
import useDebounce from '~/hooks/useDebounce';
import { ChatUtils } from '~/services/utils/chat-utils.service';
import { IConversationUsers, IMessageList } from '~/types/chat';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { setConversations, setSelectedChatUser } from '~/redux/reducers/chat/chat.reducer';
import { chatService } from '~/services/api/chat/chat.service';
import { timeAgo } from '~/services/utils/timeago.utils';
import ChatListBody from './ChatListBody';
import { socketService } from '~/services/socket/sokcet.service';
export type COMPONENT_TYPE = 'chatList' | 'searchList' | '';
const ChatList = () => {
  const { profile } = useSelector((sate: RootState) => sate.user);
  const [result, setResult] = useState<ISearchUser[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<ISearchUser | null>(null);
  const [componentType, setComponentType] = useState<COMPONENT_TYPE>('');
  const { conversations } = useSelector((state: RootState) => state.chat);
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const searchDebounce = useDebounce(searchTerm, 1000);
  const navigate = useNavigate();
  const location = useLocation();

  const searchUsers = useCallback(
    async (query: string) => {
      setIsSearching(true);
      try {
        setSearchTerm(query);
        if (query.length > 0) {
          const response = await userService.searchUser(query);
          setResult(response.data.data);
          setIsSearching(false);
        }
      } catch (error) {
        setIsSearching(false);
        Utils.addErrorNotification(error, dispatch);
      }
    },
    [dispatch]
  );

  const addSelectedUserToList = useCallback(
    async (user: ISearchUser) => {
      if (!profile) {
        return;
      }
      try {
        const newUser: IMessageList = {
          receiverId: user?._id,
          receiverUsername: user?.username,
          receiverAvatarColor: user?.avatarColor,
          receiverProfilePicture: user?.profilePicture,
          senderUsername: profile?.username as string,
          senderId: profile?._id,
          senderAvatarColor: profile?.avatarColor as string,
          senderProfilePicture: profile?.profilePicture,
          body: ''
        } as IMessageList;
        const formattedUser = ChatUtils.getSenderAndReceiverObj(profile, user);
        ChatUtils.joinRoomEvent(formattedUser, profile);
        ChatUtils.privateChatMessages = [];
        const paramsId = searchParams.get('id');
        const existingUser = conversations.find((chat) => chat.receiverId === paramsId || chat.senderId === paramsId);
        if (!existingUser) {
          const newChaMessageList = [newUser, ...conversations];
          dispatch(setConversations(newChaMessageList));

          if (!conversations.length) {
            dispatch(
              setSelectedChatUser({
                isLoading: false,
                user: newUser
              })
            );
            const body: IConversationUsers = {
              receiver: newUser.receiverUsername !== profile.username ? newUser.receiverUsername : newUser.senderUsername,
              sender: profile.username as string
            };
            await chatService.addChatUsers(body);
          }
        }
      } catch (error) {
        Utils.addErrorNotification(error, dispatch);
      }
    },
    [conversations, dispatch, searchParams, profile]
  );

  const updateQueryParams = (user: IMessageList) => {
    // setSelectedUser(user);
    const obj = {
      receiverId: user.receiverId,
      receiverName: user.receiverUsername,
      senderId: user.senderId,
      senderName: user.senderUsername
    };
    const params = ChatUtils.chatUrlParams(obj, profile as IUser);
    ChatUtils.joinRoomEvent(obj, profile as IUser);
    ChatUtils.privateChatMessages = [];
    return params;
  };

  const removeSelectedUserFromList = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const clonedChatList = Utils.cloneDeep(conversations) as IMessageList[];
    const paramsUserId = searchParams.get('id');
    const index = clonedChatList.findIndex((item) => item.receiverId === paramsUserId);

    if (index !== 1) {
      clonedChatList.splice(index, 1);
      setSelectedUser(null);
      dispatch(setConversations(clonedChatList));

      ChatUtils.updateSelectedUser({
        chatMessageList: clonedChatList,
        dispatch,
        navigate,
        params: conversations.length ? updateQueryParams(conversations[0]) : ({} as ReturnType<typeof updateQueryParams>),
        pathname: `${location.pathname}`,
        profile: profile as IUser,
        setSelectedChatUser,
        username: searchParams.get('username') as string
      });
    }
  };

  const isMatchedUsername = (data: IMessageList) => {
    const paramsUserName = searchParams.get('username');
    if (paramsUserName === data.receiverUsername.toLowerCase() || paramsUserName === data.senderUsername.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  };

  const addUsernameToURLQuery = async (user: IMessageList) => {
    try {
      const paramsUsername = searchParams.get('username');
      const existingUser = ChatUtils.chatUsers.find((chat) => chat.sender === paramsUsername || chat.receiver === paramsUsername);

      const params = updateQueryParams(user);
      const body: IConversationUsers = {
        receiver: user.receiverUsername !== profile?.username ? user.receiverUsername : user.senderUsername,
        sender: profile?.username as string
      };

      if (existingUser) {
        await chatService.removeChatUser(existingUser);
      }

      await chatService.addChatUsers(body);
      if (user?.receiverUsername.toLowerCase() === profile?.username?.toLowerCase() && !user.isRead) {
        const messageReadBody: IConversationUsers = {
          receiver: user.senderId,
          sender: profile._id
        };
        await chatService.markAsRead(messageReadBody);
      }
      navigate(`${location.pathname}?${createSearchParams(params)}`);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffect(() => {
    if (searchDebounce) {
      searchUsers(searchDebounce);
    }
  }, [searchDebounce, searchUsers]);

  useEffect(() => {
    if (!profile) return;
    // console.log('rendering-socket-effect');
    ChatUtils.socketIOChatList();
  }, [profile]);

  // useEffect(() => {
  //   if (!conversations.length) return;
  //   dispatch(setConversations(conversations));

  //   return () => {
  //     socketService.socket?.off('CHAT_LIST');
  //   };
  // }, [conversations, dispatch]);

  useEffect(() => {
    if (selectedUser && componentType === 'searchList') {
      addSelectedUserToList(selectedUser);
    }
  }, [addSelectedUserToList, componentType, selectedUser]);

  return (
    <div data-testid="chatList">
      <div className="conversation-container">
        <div className="conversation-container-header">
          <div className="header-img">
            <Avatar
              name={profile?.username as string}
              bgColor={profile?.avatarColor}
              textColor="#ffffff"
              size={40}
              avatarSrc={profile?.profilePicture as string}
            />
          </div>
          <div className="title-text">{profile?.username}</div>
        </div>

        <div className="conversation-container-search" data-testid="search-container">
          <FaSearch className="search" />
          <Input
            id="message"
            name="message"
            type="text"
            className="search-input"
            labelText=""
            placeholder="Search"
            value={searchTerm}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setIsSearching(true);
              setSearchTerm(event.target.value);
            }}
          />

          {searchTerm ? (
            <FaTimes
              className="times"
              onClick={() => {
                setIsSearching(false);
                setSearchTerm('');
              }}
            />
          ) : null}
        </div>

        <div className="conversation-container-body">
          <div className="conversation">
            {conversations.map((data) => (
              <div
                data-testid="conversation-item"
                className={`conversation-item ${isMatchedUsername(data) ? 'active' : ''}`}
                onClick={() => addUsernameToURLQuery(data)}
                key={data._id}
              >
                <div className="avatar">
                  <Avatar
                    name={data.receiverUsername !== profile?.username ? (profile?.username as string) : data.senderUsername}
                    bgColor={data.receiverUsername !== profile?.username ? data.receiverAvatarColor : data.senderAvatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={data.receiverUsername !== profile?.username ? data.receiverProfilePicture : data.senderProfilePicture}
                  />
                </div>
                <div className={`title-text ${selectedUser && !data.body ? 'selected-user-text' : ''}`}>
                  {data.receiverUsername !== profile?.username ? data.receiverUsername : data.senderUsername}
                </div>
                {data.createdAt ? <div className="created-date">{timeAgo.transform(data.createdAt)}</div> : null}
                {!data.body ? (
                  <div
                    className="created-date"
                    onClick={(event) => {
                      removeSelectedUserFromList(event);
                    }}
                  >
                    <FaTimes />
                  </div>
                ) : null}
                {data.body && !data.deleteForMe && !data.deleteForEveryone ? (
                  <ChatListBody key={`chatListBody-${data._id}`} data={data} profile={profile as IUser} />
                ) : null}
                {data.body && (data.deleteForEveryone || (data.deleteForMe && data.senderUsername === profile?.username)) ? (
                  <div className="conversation-message">
                    <span className="message-deleted">message deleted</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <SearchList
            result={result}
            isSearching={isSearching}
            searchTerm={searchTerm}
            setComponentType={setComponentType}
            setResult={setResult}
            setIsSearching={setIsSearching}
            setSearch={setSearchTerm}
            setSelectedUser={setSelectedUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatList;
