import { GcCmsSession } from '@src/session/domain/session';
import { User } from '@src/users/domain/user';
import { NullableType } from '@src/utils/types/nullable.type';

export abstract class SessionAbstractRepository {
  abstract findById(
    id: GcCmsSession['id'],
  ): Promise<NullableType<GcCmsSession>>;

  abstract create(
    data: Omit<GcCmsSession, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<GcCmsSession>;

  abstract update(
    id: GcCmsSession['id'],
    payload: Partial<
      Omit<GcCmsSession, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<GcCmsSession | null>;

  abstract deleteById(id: GcCmsSession['id']): Promise<void>;

  abstract deleteByUserId(conditions: { userId: User['id'] }): Promise<void>;

  abstract deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: GcCmsSession['id'];
  }): Promise<void>;
}
