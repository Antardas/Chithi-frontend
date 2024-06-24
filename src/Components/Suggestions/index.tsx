import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '~/Components/Avatar';
import Button from '~/Components/Button';
import '~/Components/Suggestions/Suggestion.scss';
import { addToSuggestion } from '~/redux/reducers/suggestion/suggestion.reducer';
import { RootState, useAppDispatch } from '~/redux/store';
import { FollowerUtils } from '~/services/utils/followers-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IFollower } from '~/types/follower';
import { IUser } from '~/types/user';

const Suggestion = () => {
  const { users } = useSelector((state: RootState) => state.suggestion);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const followUser = async (user: IUser) => {
    try {
      await FollowerUtils.followUser(user as unknown as IFollower, dispatch);
      const updatedUsers = users.filter((item) => item._id !== user._id);
      dispatch(addToSuggestion({ users: updatedUsers, isLoading: false }));
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  return (
    <div className="suggestions-list-container" data-testid="suggestions-container">
      <div className="suggestions-header">
        <div className="title-text">Suggestions</div>
      </div>
      <hr />
      <div className="suggestions-container">
        <div className="suggestions">
          {users?.map((user, index) => (
            <div data-testid="suggestions-item" className="suggestions-item" key={index}>
              <Avatar name={`${user.username}`} bgColor={user?.avatarColor} textColor="#ffffff" size={40} avatarSrc={user?.profilePicture} />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button label="Follow" className="button follow" disabled={false} onClick={() => followUser(user)} />
              </div>
            </div>
          ))}
        </div>
        {users?.length > 8 ? (
          <div className="view-more" onClick={() => navigate('/app/social/people')}>
            View More
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Suggestion;
