import { GcCmsSession } from '@src/session/domain/session';
import { User } from '@src/users/domain/user';

export type JwtPayloadType = Pick<User, any> & {
  sessionId: GcCmsSession['id'];
  iat: number;
  exp: number;
};
