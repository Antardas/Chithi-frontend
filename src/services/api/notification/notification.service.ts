import axiosInstance from '~/services/axios';
import { IGetALlNotificationResponse } from '~/types/notification';

class NotificationService {
  async getUserNotifications() {
    const response = await axiosInstance.get<IGetALlNotificationResponse>('/notifications');
    return response;
  }
  async markNotificationAsRead(id: string) {
    const response = await axiosInstance.put<{ message: string }>(`/notifications/${id}`);
    return response;
  }
  async deleteNotification(id: string) {
    const response = await axiosInstance.delete<{ message: string }>(`/notifications/${id}`);
    return response;
  }
}

export const notificationService: NotificationService = new NotificationService();
