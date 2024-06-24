import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '~/Components/Avatar';
import CardElement from '~/Components/CardElement';
import CardElementButton from '~/Components/CardElement/CardElementButton';
import useEffectOnce from '~/hooks/useEffectOnce';
import useInfinityScroll from '~/hooks/useInfinityScroll';
import '~/pages/social/peoples/Peoples.scss';
import { RootState, useAppDispatch } from '~/redux/store';
import { followerService } from '~/services/api/follower/follower.service';
import { userService } from '~/services/api/user/user.service';
import { socketService } from '~/services/socket/sokcet.service';
import { ChatUtils } from '~/services/utils/chat-utils.service';
import { FollowerUtils } from '~/services/utils/followers-utils.service';
import { PostUtils } from '~/services/utils/post-utils.service';
import { ProfileUtils } from '~/services/utils/profile-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IError } from '~/types/axios';
import { IFollower } from '~/types/follower';
import { IUser } from '~/types/user';
const PAGE_SIZE = 12;
const Peoples = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [followings, setFollowings] = useState<IFollower[]>([]);
  const { profile } = useSelector((state: RootState) => state.user);
  // const [_onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { onlineUsers } = useSelector((state: RootState) => state.chat);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalUser, setTotalUser] = useState<number>(0);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const bottomLineRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  let timerRef: undefined | ReturnType<typeof setTimeout>;
  const setNextPage = () => {
    console.log('setNextPage Called');

    if (!timerRef) {
      timerRef = setTimeout(() => {
        if (currentPage < Math.ceil(totalUser / PAGE_SIZE)) {
          setCurrentPage(currentPage + 1);
        }
        timerRef = undefined; // Reset timer reference
      }, 300);
    }
  };

  const getAllPost = useCallback(async () => {
    setLoading(true);
    try {
      if (currentPage) {
        const result = await userService.getAllUsers(currentPage);
        setTotalUser(result.data.data.totalUser);
        if (result.data.data.users.length) {
          const uniquePosts = [...users, ...result.data.data.users];
          const newUsers = Utils.uniqueByKey(uniquePosts, '_id');
          setUsers(newUsers);
        }
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
    setLoading(false);
  }, [currentPage, dispatch]);

  const followUser = async (user: IUser) => {
    try {
      await FollowerUtils.followUser(user as unknown as IFollower, dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  const unfollowUser = async (user: IUser) => {
    try {
      user.followersCount -= 1;
      const followObj = FollowerUtils.getFollowObj(user);
      socketService.socket.emit('UNFOLLOW_USER', followObj);
      await FollowerUtils.unfollowUser(user as unknown as IFollower, dispatch);
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
  useInfinityScroll(bodyRef, bottomLineRef, setNextPage);

  useEffectOnce(() => {
    setCurrentPage(currentPage + 1);
    getFollowings();
  });
  useEffect(() => {
    getAllPost();
  }, [getAllPost]);

  useEffect(() => {
    FollowerUtils.socketIOFollowAndUnfollow(users, followings, setUsers, setFollowings);
  }, [followings, users]);
  useEffect(() => {
    console.log(onlineUsers);
  }, [onlineUsers])
  return (
    <div className="card-container" ref={bodyRef}>
      <div className="people">People</div>
      <div className="card-element">
        {/* People Card */}
        {users.map((item, index) => (
          <div className="card-element-item" key={`users-${index}`} data-testid="card-element-item">
            {Utils.checkIfUserIsOnline(item.username as string, onlineUsers) ? (
              <div className="card-element-item-indicator">
                <FaCircle className="online-indicator" />
              </div>
            ) : null}

            <div className="card-element-header">
              <div className="card-element-header-bg"></div>
              <Avatar name={item?.username ?? ''} bgColor={item.avatarColor} textColor="#ffffff" size={120} avatarSrc={item.profilePicture} />
              <div className="card-element-header-text">
                <span className="card-element-header-name">{item.username}</span>
              </div>
            </div>

            <CardElement postCount={item.postsCount} followersCount={item.followersCount} followingCount={item.followingCount} />
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
              navigateToProfile={() => ProfileUtils.navigateToProfile(item, navigate)}
            />
          </div>
        ))}
      </div>

      {loading && !users.length ? (
        <div
          className="card-element"
          style={{
            height: '350px'
          }}
        ></div>
      ) : null}
      {!loading && !users.length ? (
        <div className="empty-page" data-testid="empty-page">
          No user available
        </div>
      ) : null}

      <div ref={bottomLineRef} style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};

export default Peoples;
