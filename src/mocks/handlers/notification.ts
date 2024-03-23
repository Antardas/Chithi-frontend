import { notificationData } from '~/mocks/data/notification.mock';
import { BASE_URL } from '~/services/axios';
import { HttpResponse, http } from 'msw';

export const emptyNotificationsMock = http.get(`${BASE_URL}/notifications`, () => {
  const result = { message: 'User notifications', data: [] };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const getUserNotificationsMock = http.get(`${BASE_URL}/notifications`, () => {
  const result = { message: 'User notifications', data: [notificationData] };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const markNotificationMock = http.put(`${BASE_URL}/notifications/12345`, () => {
  const result = { message: 'Notification marked as read' };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const deleteNotificationMock = http.delete(`${BASE_URL}/notifications/12345`, () => {
  const result = { message: 'Notification deleted successfully' };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const notificationHandlers = [getUserNotificationsMock, emptyNotificationsMock, markNotificationMock, deleteNotificationMock];
