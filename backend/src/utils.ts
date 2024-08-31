import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './constants';
import { RequestHandler } from 'express';

export function createJWT(id: number): string {
  return jwt.sign({ id }, JWT_SECRET, {});
}

export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export async function safeAwait<T>(promise: Promise<T>): Promise<[unknown, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}
