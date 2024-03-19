import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Socket, io } from 'socket.io-client';

const BASE_URL: string = `${import.meta.env.VITE_BASE_ENDPOINT}`;

class SocketService {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  setupSocketConnection() {
    this.socket = io(BASE_URL, {
      secure: true,
      transports: ['websocket']
    });

    this.socketConnectionEvents();
  }

  private socketConnectionEvents() {
    this.socket.on('connect', () => {
      console.log('connected');
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log(`Reason: ${reason}`);
      this.socket.connect();
    });

    this.socket.on('connect_error', (error) => {
      console.log(`Reason: ${error}`);
      this.socket.connect();
    });
  }
}

export const socketService: SocketService = new SocketService();
