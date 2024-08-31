import { Message, User } from 'database/types';

export interface ClientToSeverEvent {
  sendMessage: (payload: { message: Message }) => void;
}

export interface ServerToClientEvent {
  receiveMessage: (payload: { message: Message & { authorName: string } }) => void;
  test: (payload: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  user: Pick<User, 'id'>;
}
