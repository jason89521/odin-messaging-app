import { dbClient } from '@/dbClient';
import { verifyJWT } from '@/middlewares/auth';
import { asyncHandler } from '@/utils';
import { Router } from 'express';

const userRouter = Router();

userRouter.use(verifyJWT());
userRouter.get('/count', async (_, res, next) => {
  try {
    const count = await dbClient.user.count({});
    res.json({ count });
  } catch (error) {
    return next(error);
  }
});

userRouter.get(
  '/list',
  asyncHandler(async (req, res, next) => {
    const users = await dbClient.user.findMany({
      select: {
        username: true,
        id: true,
      },
      where: {
        id: { not: req.user?.id },
      },
    });

    res.json({ items: users });
  })
);

userRouter.get(
  '/me',
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new Error('Cannot find user in the request'));
    }

    return res.json(req.user);
  })
);

export { userRouter };
