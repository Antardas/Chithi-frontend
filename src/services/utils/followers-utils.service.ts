import { AppDispatch } from '~/redux/store';
import { followerService } from '../api/follower/follower.service';
import { ISocketBlockedData, IUser } from '~/types/user';
import { Utils } from './utils.service';
import { IFollower } from '~/types/follower';
import { SetState } from '~/types/utils';
import { socketService } from '../socket/sokcet.service';
import { addToSuggestion } from '~/redux/reducers/suggestion/suggestion.reducer';
import { addUser } from '~/redux/reducers/user/user.reducer';

export class FollowerUtils {
  static async followUser(user: IUser, dispatch: AppDispatch) {
    const response = await followerService.followUser(user._id);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }
  static async unfollowUser(user: IUser, dispatch: AppDispatch) {
    const response = await followerService.unfollowUser(user._id);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }
  static async blockUser(user: IFollower, dispatch: AppDispatch) {
    const response = await followerService.blockUser(user._id);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }
  static async unblockUser(user: IFollower, dispatch: AppDispatch) {
    const response = await followerService.unblockUser(user._id);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }

  // Socket Events

  static socketIOFollowAndUnfollow(users: IUser[], followers: IFollower[], setUsers: SetState<IUser[]>, setFollowers: SetState<IFollower[]>) {
    socketService.socket?.on('ADD_FOLLOWER', (follower: IFollower) => {
      const user = users.find((item) => item._id === follower._id);
      if (user) {
        const updatedFollowers = [...followers, follower];
        setFollowers(updatedFollowers);
        FollowerUtils.updateSingleUser(users, user, follower, setUsers);
      }
    });

    socketService.socket?.on('REMOVE_FOLLOWER', (follower: IFollower) => {
      const user = users.find((item) => item._id === follower._id);
      if (user) {
        const updatedFollowers = followers.filter((item) => item._id !== user._id);
        setFollowers(updatedFollowers);
        FollowerUtils.updateSingleUser(users, user, follower, setUsers);
      }
    });
  }
  static socketIOFollowSuggestion(users: IUser[], dispatch: AppDispatch) {
    socketService.socket?.on('ADD_FOLLOWER', (follower: IFollower) => {
      const clonedUser = Utils.cloneDeep(users) as IUser[];
      const userIndex = clonedUser.findIndex((item) => item._id === follower._id);
      if (userIndex) {
        clonedUser.splice(userIndex, 1);
        dispatch(addToSuggestion({ users, isLoading: false }));
      }
    });
  }
  static socketIORemoveFollowing(users: IFollower[], setFollowing: SetState<IFollower[]>) {
    socketService.socket?.on('REMOVE_FOLLOWER', (follower: IFollower) => {
      const updatedFollowing = users.filter((item) => item._id !== follower._id);
      setFollowing(updatedFollowing);
    });
  }
  static socketIOBlockAndUnblock(profile: IUser, token: string, setBlockUsers: SetState<string[]>, dispatch: AppDispatch) {
    socketService.socket?.on('BLOCK_USER_ID', (data: ISocketBlockedData) => {
      const user = FollowerUtils.addBlockedUser(profile, data);
      setBlockUsers(user.blocked);
      dispatch(
        addUser({
          profile: user,
          token
        })
      );
    });
    socketService.socket?.on('UNBLOCK_USER_ID', (data: ISocketBlockedData) => {
      const user = FollowerUtils.removeBlockUser(profile, data);
      setBlockUsers(user.blocked);
      dispatch(
        addUser({
          profile: user,
          token
        })
      );
    });
  }
  static socketIOBlockAndUnblockCard(user: IUser, setUser: SetState<IUser>) {
    socketService.socket?.on('BLOCK_USER_ID', (data: ISocketBlockedData) => {
      const userData = FollowerUtils.addBlockedUser(user, data);
      setUser(userData);
    });
    socketService.socket?.on('UNBLOCK_USER_ID', (data: ISocketBlockedData) => {
      const userData = FollowerUtils.removeBlockUser(user, data);
      setUser(userData);
    });
  }

  static addBlockedUser(user: IUser, data: ISocketBlockedData) {
    const clonedUser = Utils.cloneDeep(user) as IUser;
    if (clonedUser._id === data.blockedBy) {
      clonedUser.blocked.push(data.blockedBy);
    }
    if (clonedUser._id === data.blockedUser) {
      clonedUser.blockedBy.push(data.blockedUser);
    }

    return clonedUser;
  }
  static removeBlockUser(user: IUser, data: ISocketBlockedData) {
    const clonedUser = Utils.cloneDeep(user) as IUser;
    if (clonedUser._id === data.blockedBy) {
      clonedUser.blocked = clonedUser.blocked.filter((item) => item !== data.blockedBy);
    }
    if (clonedUser._id === data.blockedUser) {
      clonedUser.blockedBy = clonedUser.blockedBy.filter((item) => item !== data.blockedUser);
    }

    return clonedUser;
  }

  static updateSingleUser(users: IUser[], userData: IUser, follower: IFollower, setUsers: SetState<IUser[]>) {
    const clonedUser = Utils.cloneDeep(users) as IUser[];

    userData.followersCount = follower.followersCount;
    userData.followingCount = follower.followingCount;
    userData.postsCount = follower.postCount;

    const index = clonedUser.findIndex((item) => item._id === userData._id);

    if (index > -1) {
      users.splice(index, 1, userData);
      setUsers(users);
    }
  }

  static getFollowObj(user: IUser): IFollower {
    return {
      _id: user._id,
      avatarColor: user.avatarColor ?? '',
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postCount: user.postsCount,
      profilePicture: user.profilePicture,
      uId: user.uId ?? '',
      username: user.username ?? '',
      userProfile: Utils.cloneDeep(user) as IUser
    };
  }
}
