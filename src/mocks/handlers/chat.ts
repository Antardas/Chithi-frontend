import { HttpResponse, http } from 'msw';
import { BASE_URL } from '~/services/axios';
import { messageData } from '../data/chat.mock';

export const emptyChatListMock = http.get(`${BASE_URL}/chat/message/conversation`, () => {
  const result = { message: 'User conversation list', data: [] };
  return HttpResponse.json(result, { status: 200 });
});

export const chatListMock = http.get(`${BASE_URL}/chat/message/conversation`, () => {
  const result = { message: 'User conversation list', data: [messageData] };
  return HttpResponse.json(result, { status: 200 });
});

export const chatMessagesMock = http.get(`${BASE_URL}/chat/message/user/123456`, () => {
  const result = { message: 'User chat messages', messages: [messageData, messageData] };
  return HttpResponse.json(result, { status: 200 });
});

export const chatMessagesUserTwoMock = http.get(`${BASE_URL}/chat/message/user/222222`, () => {
  const result = { message: 'User chat messages', messages: [messageData, messageData] };
  return HttpResponse.json(result, { status: 200 });
});

export const addChatUsersMock = http.post(`${BASE_URL}/chat/message/add-chat-users`, () => {
  const result = { message: 'Users added' };
  return HttpResponse.json(result, { status: 200 });
});

export const chatHandlers = [emptyChatListMock, chatListMock, chatMessagesMock, addChatUsersMock, chatMessagesUserTwoMock];
