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
import { ChatUtils, IMessageDataParams } from '~/services/utils/chat-utils.service';
import { IConversationUsers, IMessageList } from '~/types/chat';
import { useSearchParams } from 'react-router-dom';
import { setSelectedChatUser } from '~/redux/reducers/chat/chat.reducer';
import { chatService } from '~/services/api/chat/chat.service';
export type COMPONENT_TYPE = 'chatList' | 'searchList' | '';
const ChatList = () => {
  const { profile } = useSelector((sate: RootState) => sate.user);
  const { chatList } = useSelector((sate: RootState) => sate.chat);
  const removeSelectedUserFromList = () => {};
  const [result, setResult] = useState<ISearchUser[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<ISearchUser | null>(null);
  const [componentType, setComponentType] = useState<COMPONENT_TYPE>('');
  const [chatMessageList, setChatMessageList] = useState<IMessageList[]>([]);
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const searchDebounce = useDebounce(searchTerm, 1000);

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
      console.log('Reached here ', 2);
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
        const existingUser = chatMessageList.find((chat) => chat.receiverId === paramsId || chat.senderId === paramsId);
        if (!existingUser) {
          console.log('Reached here ', 3);
          const newChaMessageList = [newUser, ...chatMessageList];
          setChatMessageList(newChaMessageList);

          if (!chatList.length) {
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
    [chatList, chatMessageList, dispatch, searchParams, profile]
  );
  useEffect(() => {
    if (searchDebounce) {
      searchUsers(searchDebounce);
    }
  }, [searchDebounce, searchUsers]);

  useEffect(() => {
    console.log('run run  run');

    setChatMessageList(chatList);
  }, [chatList]);

  useEffect(() => {
    if (selectedUser && componentType === 'searchList') {
      console.log('isnt it called');

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
            {[].map((_data) => (
              <div data-testid="conversation-item" className="conversation-item">
                <div className="avatar">
                  <Avatar name="placeholder" bgColor="red" textColor="#ffffff" size={40} avatarSrc="" />
                </div>
                <div className="title-text">Danny</div>
                <div className="created-date">1 hr ago</div>
                <div className="created-date" onClick={removeSelectedUserFromList}>
                  <FaTimes />
                </div>
                {'<'} !-- chat list body component -- {'>'}
                <div className="conversation-message">
                  <span className="message-deleted">message deleted</span>
                </div>
                <div className="conversation-message">
                  <span className="message-deleted">message deleted</span>
                </div>
                {' <!-- '}chat list body component {'-->'}
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
