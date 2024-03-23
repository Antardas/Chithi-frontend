import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Socket, io } from 'socket.io-client';
import { setSocketConnected } from '~/redux/reducers/app/app.reducer';
import { store } from '~/redux/store';

const BASE_URL: string = `${import.meta.env.VITE_BASE_ENDPOINT}`;

class SocketService {
  public socket!: Socket<DefaultEventsMap, DefaultEventsMap>;

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
      store.dispatch(setSocketConnected({ socketConnected: true }));
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log(`Reason: ${reason}`);
      this.socket.connect();
      store.dispatch(setSocketConnected({ socketConnected: false }));
    });

    this.socket.on('connect_error', (error) => {
      console.log(`Reason: ${error}`);
      this.socket.connect();
      store.dispatch(setSocketConnected({ socketConnected: false }));
    });
  }
}

export const socketService: SocketService = new SocketService();
