import { RequestHandler } from 'express';
import passport from 'passport';

export function verifyJWT(): RequestHandler {
  return passport.authenticate('jwt', { session: false });
}
