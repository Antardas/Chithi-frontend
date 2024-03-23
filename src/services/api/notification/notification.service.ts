import axios from '~/services/axios';
import { IGetALlNotificationResponse } from '~/types/notification';

class NotificationService {
  async getUserNotifications() {
    const response = await axios.get<IGetALlNotificationResponse>('/notifications');
    return response;
  }
  async markNotificationAsRead(id: string) {
    const response = await axios.put<{ message: string }>(`/notifications/${id}`);
    return response;
  }
  async deleteNotification(id: string) {
    const response = await axios.delete<{ message: string }>(`/notifications/${id}`);
    return response;
  }
}

export const notificationService: NotificationService = new NotificationService();
