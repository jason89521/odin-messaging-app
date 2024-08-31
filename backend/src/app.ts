import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { ORIGIN } from './constants';
import { createSocketIO } from 'socket';
import { Message } from 'database/types';
import { safeAwait } from './utils';
import { dbClient } from './dbClient';

dotenv.config();
export const app = express();
export const server = createServer(app);
export const io = createSocketIO(server, { cors: { origin: [ORIGIN] } });

export async function emitReceiveMessage(message: Message & { authorName: string }) {
  const { chatId } = message;
  const connectedUsers = [...io.of('/').sockets.entries()].map(([_, s]) => {
    return { ...s.data.user };
  });
  // Find all users in this chat.
  const [_, chat] = await safeAwait(
    dbClient.chat.findUnique({
      select: { users: { select: { id: true } } },
      where: { id: chatId },
    })
  );
  // If the user in this chat is connected, emit event to them.
  const usersToEmit = (chat?.users ?? []).filter(({ id }) => {
    return (
      id !== message.authorId &&
      connectedUsers.findIndex(cu => {
        return cu.id === id;
      }) !== -1
    );
  });

  console.log('userToEmit', usersToEmit);

  for (const { id } of usersToEmit) {
    io.to(id.toString()).emit('receiveMessage', { message });
  }
}
