import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { dbClient } from '@/dbClient';
import { JWT_SECRET } from '@/constants';

export function setUpPassport() {
  passport.use(
    new JWTStrategy(
      { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET },
      async (payload: { id: number }, done) => {
        const { id } = payload;
        try {
          const user = await dbClient.user.findUnique({ where: { id }, omit: { password: true } });
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
}
