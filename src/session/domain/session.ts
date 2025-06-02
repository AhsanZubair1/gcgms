import { GcCmsUser } from '@src/users/domain/gc-cms-user';

export class GcCmsSession {
  id: number | string;
  gcCmsUser: GcCmsUser;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
