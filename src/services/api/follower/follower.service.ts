import axios from '~/services/axios';
import { OnlyMessageResponse } from '~/types/axios';
import { GetFollowingsResponse } from '~/types/follower';

class FollowerService {
  async getUserFollowing() {
    const response = await axios.get<GetFollowingsResponse>('/users/followings');
    return response;
  }
  async getUserFollowers(userId: string) {
    const response = await axios.get<GetFollowingsResponse>(`/users/followers/${userId}`);
    return response;
  }
  async followUser(followeeId: string) {
    const response = await axios.put<OnlyMessageResponse>(`/users/follow/${followeeId}`);
    return response;
  }
  async unfollowUser(followeeId: string) {
    const response = await axios.put<OnlyMessageResponse>(`/users/unfollow/${followeeId}`);
    return response;
  }
  async blockUser(userId: string) {
    const response = await axios.put<OnlyMessageResponse>(`/users/block/${userId}`);
    return response;
  }
  async unblockUser(userId: string) {
    const response = await axios.put<OnlyMessageResponse>(`/users/unblock/${userId}`);
    return response;
  }
}

export const followerService: FollowerService = new FollowerService();
