import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, matchedData, validationResult } from 'express-validator';
import { createJWT } from '@/utils';
import { dbClient } from '@/dbClient';

function getValidations() {
  return [
    body('username').trim().notEmpty().escape(),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('The length of password should be greater than 6 and less than 20'),
  ];
}

const authRouter = Router();

authRouter.post('/sign-up', ...getValidations(), async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await dbClient.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
      omit: { password: true },
    });
    res.json({ jwt: createJWT(user.id) });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/login', ...getValidations(), async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  const { username, password } = matchedData<{ username: string; password: string }>(req);
  try {
    const user = await dbClient.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Password not match' });
    }

    res.json({ jwt: createJWT(user.id) });
  } catch (error) {
    next(error);
  }
});

export { authRouter };
