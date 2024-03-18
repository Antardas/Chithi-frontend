import axios from '~/services/axios';

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
}

export const userService: UserService = new UserService();
