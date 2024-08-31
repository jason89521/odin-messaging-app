import { dbClient } from '@/dbClient';
import { RequestHandler } from 'express';
import { param, query, validationResult } from 'express-validator';

export function validateResult(): RequestHandler {
  return (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: result.array() });
  };
}

export function validateChatId() {
  return param('chatId').custom(async value => {
    if (typeof value !== 'string') {
      throw new Error('Invalid chat id');
    }
    try {
      const chat = await dbClient.chat.findUnique({ where: { id: value } });
      if (!chat) {
        throw new Error(`Cannot find chat with id: ${value}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Cannot find chat with id: ${value}`);
    }
  });
}

export function validateBefore() {
  return query('before').optional().trim().notEmpty().isDate();
}
