import { GcCmsSession } from '@src/session/domain/session';

export type JwtRefreshPayloadType = {
  sessionId: GcCmsSession['id'];
  hash: GcCmsSession['hash'];
  iat: number;
  exp: number;
};
