import { User as DUser, Message as DMessage } from 'database/types';

export interface User extends Omit<DUser, 'password'> {}

export interface Message extends Omit<DMessage, 'chatId'> {
  authorName: string;
}
