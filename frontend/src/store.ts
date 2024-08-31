import { reactive } from 'vue';
import { User } from './types';
import { Socket as OriginalSocket } from 'socket.io-client';
import { ClientToSeverEvent, ServerToClientEvent } from 'socket/types';
import { api } from './api';
import { createSocket } from './socket';

interface Socket extends OriginalSocket<ServerToClientEvent, ClientToSeverEvent> {}

interface StoreData {
  me?: User;
  socket?: Socket;
  jwt: string | null;
  getMeOrThrow(): User;
  getSocketOrThrow(): Socket;
  updateJWT(jwt: string): void;
  updateMe(user?: User): void;
  logout(): void;
  init(): Promise<boolean>;
  setup(jwt: string): Promise<boolean>;
}

const JWT_KEY = 'jwt';

export const store = reactive<StoreData>({
  jwt: localStorage.getItem(JWT_KEY),
  getMeOrThrow() {
    if (!this.me) {
      throw new Error('Me is undefined');
    }

    return this.me;
  },
  getSocketOrThrow() {
    if (!this.socket) {
      throw new Error('Socket is undefined');
    }

    return this.socket;
  },
  updateJWT(jwt) {
    this.jwt = jwt;
    api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    localStorage.setItem(JWT_KEY, jwt);
  },
  updateMe(user) {
    this.me = user;
  },
  logout() {
    this.jwt = null;
    this.socket?.disconnect();
    localStorage.removeItem(JWT_KEY);
    delete this.me;
  },
  async init() {
    const jwt = this.jwt;
    if (!jwt) {
      return false;
    }
    return this.setup(jwt);
  },
  async setup(jwt: string) {
    this.updateJWT(jwt);
    this.socket?.disconnect();
    this.socket = createSocket({ jwt });
    this.socket.connect();
    try {
      const res = await api.get<User>('/users/me');
      this.updateMe(res.data);
      return true;
    } catch (error) {
      return false;
    }
  },
});
