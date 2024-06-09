import React, { useCallback, useEffect, useState } from 'react';
import '~/pages/social/followers/Followers.scss';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '~/Components/Avatar';
import CardElement from '~/Components/CardElement';
import CardElementButton from '~/Components/CardElement/CardElementButton';
import { RootState, useAppDispatch } from '~/redux/store';
import { followerService } from '~/services/api/follower/follower.service';
import { socketService } from '~/services/socket/sokcet.service';
import { FollowerUtils } from '~/services/utils/followers-utils.service';
import { ProfileUtils } from '~/services/utils/profile-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IFollower } from '~/types/follower';
import { ISocketBlockedData, IUser } from '~/types/user';

const Followers = () => {
  const [followers, setFollowers] = useState<IFollower[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const { profile, token } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getFollowers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await followerService.getUserFollowers(profile?._id as string);
      setFollowers(result.data.data);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
    setLoading(false);
  }, [dispatch, profile?._id]);

  const blockUser = async (user: IFollower) => {
    try {
      const obj: ISocketBlockedData = {
        blockedBy: profile?._id as string,
        blockedUser: user._id
      };
      socketService.socket.emit('BLOCK_USER', obj);

      await FollowerUtils.blockUser(user, dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  const unblockUser = async (user: IFollower) => {
    try {
      const obj: ISocketBlockedData = {
        blockedBy: profile?._id as string,
        blockedUser: user._id
      };
      socketService.socket.emit('UNBLOCK_USER', obj);

      await FollowerUtils.unblockUser(user, dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffect(() => {
    FollowerUtils.socketIOBlockAndUnblock(profile as IUser, token, setBlockedUsers, dispatch);
  }, [dispatch, profile, token]);

  useEffect(() => {
    getFollowers();
    setBlockedUsers(profile?.blocked ?? []);
  }, [getFollowers, profile?.blocked]);
  return (
    <div className="card-container">
      <div className="people">Followers</div>
      <div className={`${followers.length && 'card-element'}`}>
        {/* People Card */}
        {followers.map((item, index) => (
          <div className="card-element-item" key={`users-${item._id}`} data-testid="card-element-item">
            <div className="card-element-header">
              <div className="card-element-header-bg"></div>
              <Avatar name={item.username} bgColor={item.avatarColor} textColor="#ffffff" size={120} avatarSrc={item.profilePicture} />
              <div className="card-element-header-text">
                <span className="card-element-header-name">{item.username}</span>
              </div>
            </div>

            <CardElement postCount={item.postCount} followersCount={item.followersCount} followingCount={item.followingCount} />
            <CardElementButton
              isChecked={Utils.checkIfUserIsBlocked(blockedUsers, item._id)}
              btnTextOne="Block"
              btnTextTwo="Unblock"
              onClickBtnOne={() => blockUser(item)}
              onClickBtnTwo={() => unblockUser(item)}
              navigateToProfile={() => ProfileUtils.navigateToProfile(item, navigate)}
            />
          </div>
        ))}
      </div>

      {loading && !followers.length ? (
        <div
          className="card-element"
          style={{
            height: '350px'
          }}
        ></div>
      ) : null}
      {!loading && !followers.length ? (
        <div className="empty-page" data-testid="empty-page">
          you have no followers
        </div>
      ) : null}
    </div>
  );
};

export default Followers;
