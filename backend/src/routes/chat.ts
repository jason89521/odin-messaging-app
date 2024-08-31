import { dbClient } from '@/dbClient';
import { verifyJWT } from '@/middlewares/auth';
import { validateResult } from '@/middlewares/validation';
import { asyncHandler } from '@/utils';
import { Router } from 'express';
import { body, matchedData } from 'express-validator';

const chatRouter = Router();

chatRouter.use(verifyJWT());

chatRouter.post(
  '/create',
  body('admin').trim().isNumeric().notEmpty(),
  body('user').trim().isNumeric().notEmpty(),
  body('name').trim().notEmpty(),
  validateResult(),
  asyncHandler(async (req, res) => {
    const { admin, user, name } = matchedData<{ admin: string; user: string; name: string }>(req);
    const [adminId, userId] = [parseInt(admin), parseInt(user)];
    const usersExist =
      (await dbClient.user.count({ where: { OR: [{ id: adminId }, { id: userId }] } })) === 2;
    if (!usersExist) {
      return res.status(400).json({ error: 'Both user should exist' });
    }

    const chat = await dbClient.chat.create({
      data: {
        users: { connect: [{ id: adminId }, { id: userId }] },
        name,
        admin: { connect: { id: adminId } },
      },
    });

    return res.status(201).json({ id: chat.id });
  })
);

chatRouter.get(
  '/list',
  asyncHandler(async (req, res, next) => {
    const user = await dbClient.user.findUnique({
      where: { id: req.user?.id },
      include: { chats: true },
    });

    return res.json({ items: user?.chats ?? [] });
  })
);

export { chatRouter };
