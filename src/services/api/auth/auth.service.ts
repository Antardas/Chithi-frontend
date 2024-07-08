import axiosInstance from '~/services/axios';
import { ISignInData, ISignupData, ResetPasswordData } from '~/types/auth';

class AuthService {
  async singUp(body: ISignupData) {
    const response = await axiosInstance.post('/signup', body);
    return response;
  }
  async singIn(body: ISignInData) {
    const response = await axiosInstance.post('/signin', body);
    return response;
  }
  async forgotPassword(email: string) {
    const response = await axiosInstance.post('/forgot-password', { email });
    return response;
  }
  async resetPassword(token: string, body: ResetPasswordData) {
    const response = await axiosInstance.post(`/reset-password/${token}`, body);
    return response;
  }
}
export const authService: AuthService = new AuthService();
