import React from 'react';
import { SetState } from '~/types/utils';
import '~/Components/Chat/Search/SearchList.scss';
import Avatar from '~/Components/Avatar';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { IUser } from '~/types/user';
const SearchList = ({
  isSearching,
  result,
  searchTerm,
  setComponentType,
  setIsSearching,
  setResult,
  setSearch,
  setSelectedUser
}: SearchListProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const addUsernameToUrlQuery = (user: IUser) => {
    setComponentType('searchList');
    setSelectedUser(user);
    const url = `${location.pathname}?${createSearchParams({ username: user?.username as string, id: user._id })}`;
    setSearch('');
    setIsSearching(false);
    setResult([]);
    navigate(url);
  };
  return (
    <div className="search-result">
      <div className="search-result-container">
        {!isSearching && result.length > 0
          ? result.map((user) => (
              <div
                className="search-result-container-item"
                data-testid="search-result-item"
                key={user._id}
                onClick={() => addUsernameToUrlQuery(user)}
              >
                <Avatar name={user.usename} bgColor={user.avatarColor} textColor="#ffffff" size={40} avatarSrc={user.profilePicture} />
                <div className="username">{user.username}</div>
              </div>
            ))
          : null}

        {searchTerm && isSearching && result.length === 0 ? (
          <div className="search-result-container-empty" data-testid="searching-text">
            <span>Searching....</span>
          </div>
        ) : null}
        {searchTerm && !isSearching && result.length === 0 ? (
          <div className="search-result-container-empty" data-testid="nothing-found ">
            <span>Nothing Found....</span>
            <p className="search-result-container-empty-msg">we couldn&apos;t find any message for {searchTerm}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default SearchList;

export interface SearchListProps {
  result: IUser[];
  isSearching: boolean;
  searchTerm: string;
  setSelectedUser: SetState<IUser | null>;
  setSearch: SetState<string>;
  setIsSearching: SetState<boolean>;
  setResult: SetState<IUser[]>;
  setComponentType: SetState<string>;
}
