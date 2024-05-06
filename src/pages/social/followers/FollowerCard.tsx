import React, { useEffect, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import Avatar from '~/Components/Avatar';
import Button from '~/Components/Button';
import useEffectOnce from '~/hooks/useEffectOnce';
import { RootState, useAppDispatch } from '~/redux/store';
import { followerService } from '~/services/api/follower/follower.service';
import { userService } from '~/services/api/user/user.service';
import { socketService } from '~/services/socket/sokcet.service';
import { FollowerUtils } from '~/services/utils/followers-utils.service';
import { PostUtils } from '~/services/utils/post-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IFollower } from '~/types/follower';
import { ISocketBlockedData, IUser } from '~/types/user';
import '~/pages/social/followers/Followers.scss'
const FollowerCard = ({ userData }: Props) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [followers, setFollowers] = useState<IFollower[]>([]);
  const [user, setUser] = useState<IUser>(userData);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { username } = useParams();

  const blockUser = (userInfo: IFollower) => {
    try {
      const obj: ISocketBlockedData = {
        blockedBy: user?._id as string,
        blockedUser: userInfo._id
      };
      socketService?.socket?.emit('BLOCK_USER', obj);
      FollowerUtils.blockUser(userInfo, dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const getUserProfileByUsername = async () => {
    const id = searchParams.get('id'),
      uId = searchParams.get('id');
    console.log(id, uId, username);

    if (!id || !uId || !username) {
      return;
    }
    try {
      const response = await userService.getUserByUsername({
        id,
        uId,
        username
      });
      setUser(response.data.data.user);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const getUserFollowers = async () => {
    const id = searchParams.get('id');
    if (!id) {
      return;
    }
    try {
      const response = await followerService.getUserFollowers(id);
      setFollowers(response.data.data);
      setLoading(false);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const unblockUser = (userInfo: IFollower) => {
    try {
      const obj: ISocketBlockedData = {
        blockedBy: user?._id as string,
        blockedUser: userInfo._id
      };
      socketService?.socket?.emit('UNBLOCK_USER', obj);
      FollowerUtils.unblockUser(userInfo, dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffectOnce(() => {
    getUserProfileByUsername();
    getUserFollowers();
  });

  useEffect(() => {
    FollowerUtils.socketIOBlockAndUnblockCard(user, setUser);
  }, [user]);

  return (
    <div data-testid="followers-card">
      {followers.length > 0 && (
        <div className="follower-card-container">
          {followers.map((data) => (
            <div className="follower-card-container-elements" key={data?._id} data-testid="card-element-item">
              <div className="follower-card-container-elements-content">
                <div className="card-avatar">
                  <Avatar name={data?.username} bgColor={data?.avatarColor} textColor="#ffffff" size={60} avatarSrc={data?.profilePicture} />
                </div>
                <div className="card-user">
                  <span className="name">{data?.username}</span>
                  <p className="count">
                    <FaUserPlus className="heart" /> <span data-testid="count">{PostUtils.shortenLargeNumberReactions(data?.followingCount)}</span>
                  </p>
                </div>
                {username === profile?.username && (
                  <div className="card-following-button" data-testid="card-following-button">
                    {!Utils.checkIfUserIsBlocked(user?.blocked, data?._id) && (
                      <Button label="Block" className="following-button" disabled={false} handleClick={() => blockUser(data)} />
                    )}
                    {Utils.checkIfUserIsBlocked(user?.blocked, data?._id) && (
                      <Button label="Unblock" className="following-button isUserFollowed" disabled={false} handleClick={() => unblockUser(data)} />
                    )}
                    {/* TODO: Optimize here */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !followers.length && <div className="empty-page">There are no followers to display</div>}
    </div>
  );
};

interface Props {
  userData: IUser;
}

export default FollowerCard;
