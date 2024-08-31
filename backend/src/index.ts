import express, { ErrorRequestHandler, RequestHandler } from 'express';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import cors from 'cors';
import { setUpPassport } from './setups/passport';
import cookieParser from 'cookie-parser';
import { verifyJWT } from './middlewares/auth';
import { chatRouter } from './routes/chat';
import { messageRouter } from './routes/message';
import { User } from 'database/types';
import { ORIGIN } from './constants';
import { app, server, io } from './app';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};

// setups
setUpPassport();
// middlewares
app.use(cors({ origin: [ORIGIN] }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/chats', chatRouter);
app.use('/messages', messageRouter);

app.get('/foo', verifyJWT(), (req, res) => {
  res.json({ message: 'jwt', user: req.user });
});

app.use(errorHandler);
app.all('*', (_, res) => {
  res.sendStatus(404);
});

server.listen(5566, '0.0.0.0', () => {
  console.log('Listening on port 5566');
});

const ioAuth: RequestHandler = (req, res, next) => {
  const isHandshake = typeof req?._query?.sid === 'undefined';
  if (isHandshake) {
    verifyJWT()(req, res, next);
  } else {
    next();
  }
};

io.engine.use(ioAuth);

io.on('connection', socket => {
  const user = (socket.request as any).user as User;
  socket.data.user = { ...user };
  socket.join(user.id.toString());

  console.log('connected user: ', user.username);

  socket.onAny((event, args) => {
    console.log(event, args);
  });
});
