import { Server as SocketServer, ServerOptions } from 'socket.io';
import { Server } from 'node:http';
import { ClientToSeverEvent, InterServerEvents, ServerToClientEvent, SocketData } from './types';

export function createSocketIO(server: Server, opts: Partial<ServerOptions>) {
  const io = new SocketServer<
    ClientToSeverEvent,
    ServerToClientEvent,
    InterServerEvents,
    SocketData
  >(server, opts);

  return io;
}
