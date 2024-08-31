import { User as UserModel } from 'database/types';
import express from 'express';

interface SocketIoRequest {
  _query?: {
    sid?: string;
  };
}

declare global {
  namespace Express {
    interface User extends UserModel {}
    interface Request extends SocketIoRequest {}
  }
}
