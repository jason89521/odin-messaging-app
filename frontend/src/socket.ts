import { io, Socket } from 'socket.io-client';
import { API_URL } from './constants';
import { ClientToSeverEvent, ServerToClientEvent } from 'socket/types';

export function createSocket({ jwt }: { jwt: string }) {
  const socket: Socket<ServerToClientEvent, ClientToSeverEvent> = io(API_URL, {
    extraHeaders: {
      Authorization: `bearer ${jwt}`,
    },
    autoConnect: false,
  });

  socket.onAny((event, ...args) => {
    console.log('socket event: ', event);
    console.log('args: ', args);
  });
  return socket;
}
