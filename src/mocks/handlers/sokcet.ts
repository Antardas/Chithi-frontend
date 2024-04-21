import { HttpResponse, http } from 'msw';
import { BASE_URL } from '~/services/axios';

export const socketIOMock = http.get(`${BASE_URL}`, () => {
  const result = { message: 'Websocket connected successfully' };
  return HttpResponse.json(result, { status: 200 });
});

export const socketHandlers = [socketIOMock];
