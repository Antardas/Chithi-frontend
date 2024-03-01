import axios from '../../axios';
import { ISignInData, ISignupData } from '../../../types/auth';

class AuthService {
  async singUp(body: ISignupData) {
    const response = await axios.post('/signup', body);
    return response;
  }
  async singIn(body: ISignInData) {
    const response = await axios.post('/signin', body);
    return response;
  }
  async forgotPassword(email: string) {
    const response = await axios.post('/forgot-password', { email });
    return response;
  }
  async resetPassword(token: string, body: any) {
    const response = await axios.post(`/reset-password/${token}`, body);
    return response;
  }
}
export const authService: AuthService = new AuthService();
