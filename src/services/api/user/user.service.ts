import axios from '~/services/axios';
import { GetUsersResponse } from '~/types/follower';
import { IGetUserById, IGetUserByUsername, ISearchUserResponse } from '~/types/user';

class UserService {
  async getUserSuggestion() {
    const response = await axios.get('/users/suggestions');
    return response;
  }
  async logoutUser() {
    const response = await axios.get('/signout');
    return response;
  }
  async currentUser() {
    const response = await axios.get('/current-user');
    return response;
  }
  async getUserById(id: string) {
    const response = await axios.get<IGetUserById>(`/users/${id}`);
    return response;
  }
  async getUserByUsername(params: { id: string; username: string; uId: string }) {
    const { id, uId, username } = params;
    const response = await axios.get<IGetUserByUsername>(`/users/${id}/${username}/${uId}`);
    return response;
  }
  async getAllUsers(page: number) {
    const response = await axios.get<GetUsersResponse>(`/users?page=${page}`);
    return response;
  }

  async searchUser(query: string) {
    const response = await axios.get<ISearchUserResponse>(`/users/search/${query}/`);
    return response;
  }
}

export const userService: UserService = new UserService();
