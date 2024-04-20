import axios from '~/services/axios';
import { GetUsersResponse } from '~/types/follower';

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
  async getAllUsers(page: number) {
    const response = await axios.get<GetUsersResponse>(`/users?page=${page}`);
    return response;
  }
}

export const userService: UserService = new UserService();
