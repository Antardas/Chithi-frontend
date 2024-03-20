import axios from '~/services/axios';
import { IGetALlNotificationResponse } from '~/types/notification';

class NotificationService {
  async getUserNotifications() {
    const response = await axios.get<IGetALlNotificationResponse>('/notifications');
    return response;
  }
}

export const notificationService: NotificationService = new NotificationService();
