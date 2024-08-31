import { emitReceiveMessage } from '@/app';
import { PAGINATION_SIZE } from '@/constants';
import { dbClient } from '@/dbClient';
import { verifyJWT } from '@/middlewares/auth';
import { validateBefore, validateChatId, validateResult } from '@/middlewares/validation';
import { asyncHandler } from '@/utils';
import { Router } from 'express';
import { body, matchedData } from 'express-validator';

const messageRouter = Router();

messageRouter.use(verifyJWT());

messageRouter.get(
  '/:chatId',
  validateChatId(),
  validateBefore(),
  validateResult(),
  asyncHandler(async (req, res) => {
    const { chatId, before } = matchedData<{ chatId: string; before?: string }>(req);
    const messages = await dbClient.message.findMany({
      where: { chatId, createdAt: { lt: before } },
      include: { author: { select: { username: true } } },
      orderBy: {
        createdAt: 'desc',
      },
      omit: { chatId: true },
      take: PAGINATION_SIZE,
    });
    messages.reverse();

    return res.json({
      items: messages.map(message => {
        const { author, ...newMessage } = message;
        return { authorName: author.username, ...newMessage };
      }),
      before: messages[PAGINATION_SIZE]?.createdAt ?? null,
    });
  })
);

messageRouter.post(
  '/:chatId/new',
  validateChatId(),
  body('content').trim().notEmpty(),
  validateResult(),
  asyncHandler(async (req, res) => {
    const { chatId, content } = matchedData<{ chatId: string; content: string }>(req);

    const { author, ...rest } = await dbClient.message.create({
      data: {
        content,
        author: { connect: { id: req.user?.id } },
        chat: { connect: { id: chatId } },
      },
      include: { author: { select: { username: true } } },
    });
    const message = { authorName: author.username, ...rest };
    await emitReceiveMessage(message);

    return res.status(201).json({ message });
  })
);

export { messageRouter };
