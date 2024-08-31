import dotenv from 'dotenv';

dotenv.config();

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (secret) {
    return secret;
  }
  if (IS_DEVELOPMENT) {
    return 'supersecret';
  }

  throw new Error('Cannot find secret in env.');
})();
export const ORIGIN = (() => {
  const origin = process.env.ORIGIN;
  if (origin) {
    return origin;
  }

  throw new Error('Cannot find origin in env.');
})();
export const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 5566;

export const PAGINATION_SIZE = 20;
