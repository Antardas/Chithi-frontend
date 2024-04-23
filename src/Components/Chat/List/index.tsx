import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Avatar from '~/Components/Avatar';
import '~/Components/Chat/List/ChatList.scss';
import Input from '~/Components/Input';
import { RootState } from '~/redux/store';
import SearchList from '../Search';
import { IUser } from '~/types/user';
const ChatList = () => {
  const { profile } = useSelector((sate: RootState) => sate.user);
  const { chatList } = useSelector((sate: RootState) => sate.chat);
  const removeSelectedUserFromList = () => {};
  const [result, setResult] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [componentType, setComponentType] = useState<string>('chatList');


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
          <Input id="message" name="message" type="text" className="search-input" labelText="" placeholder="Search" />
          <FaTimes className="times" />
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
