import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '~/Components/Avatar';
import CardElement from '~/Components/CardElement';
import CardElementButton from '~/Components/CardElement/CardElementButton';
import useEffectOnce from '~/hooks/useEffectOnce';
import '~/pages/social/followings/Followings.scss';
import { RootState, useAppDispatch } from '~/redux/store';
import { followerService } from '~/services/api/follower/follower.service';
import { socketService } from '~/services/socket/sokcet.service';
import { FollowerUtils } from '~/services/utils/followers-utils.service';
import { ProfileUtils } from '~/services/utils/profile-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IFollower } from '~/types/follower';
import { IUser } from '~/types/user';
const Followings = () => {
  const [followings, setFollowings] = useState<IFollower[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const followUser = async (user: IFollower) => {
    try {
      await FollowerUtils.followUser(user, dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  const unfollowUser = async (user: IFollower) => {
    try {
      socketService.socket.emit('UNFOLLOW_USER', user);
      await FollowerUtils.unfollowUser(user, dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  const getFollowings = async () => {
    try {
      const result = await followerService.getUserFollowing();
      if (result.data.data.length) {
        const newUsers = Utils.uniqueByKey(result.data.data, '_id');
        setFollowings(newUsers);
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffectOnce(() => {
    getFollowings();
  });

  useEffect(() => {
    FollowerUtils.socketIORemoveFollowing(followings, setFollowings);
  }, [followings]);
  return (
    <div className="card-container">
      <div className="people">Following</div>
      <div className={`${followings.length && 'card-element'}`}>
        {/* People Card */}
        {followings.map((item, index) => (
          <div className="card-element-item" key={`users-${index}`} data-testid="card-element-item">
            <div className="card-element-header">
              <div className="card-element-header-bg"></div>
              <Avatar name={item.username} bgColor={item.avatarColor} textColor="#ffffff" size={120} avatarSrc={item.profilePicture} />
              <div className="card-element-header-text">
                <span className="card-element-header-name">{item.username}</span>
              </div>
            </div>

            <CardElement postCount={item.postCount} followersCount={item.followersCount} followingCount={item.followingCount} />
            <CardElementButton
              isChecked={Utils.checkIfUserIsFollowed(
                followings.map((follower) => follower._id),
                item?._id as string,
                ''
              )}
              btnTextOne="Follow"
              btnTextTwo="Unfollow"
              onClickBtnOne={() => followUser(item)}
              onClickBtnTwo={() => unfollowUser(item)}
              navigateToProfile={() => ProfileUtils.navigateToProfile(item as unknown as IUser, navigate)}
            />
          </div>
        ))}
      </div>

      {loading && !followings.length ? (
        <div
          className="card-element"
          style={{
            height: '350px'
          }}
        ></div>
      ) : null}
      {!loading && !followings.length ? (
        <div className="empty-page" data-testid="empty-page">
          you have not following
        </div>
      ) : null}
    </div>
  );
};

export default Followings;
