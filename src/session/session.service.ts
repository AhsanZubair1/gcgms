import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { User } from '@src/users/domain/user';
import { NullableType } from '@src/utils/types/nullable.type';

import { GcCmsSession } from './domain/session';
import { SessionAbstractRepository } from './infrastructure/persistence/session.abstract.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionAbstractRepository) {}

  findById(id: GcCmsSession['id']): Promise<NullableType<GcCmsSession>> {
    return this.findAndValidate('id', id);
  }

  create(
    data: Omit<GcCmsSession, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<GcCmsSession> {
    return this.sessionRepository.create(data);
  }

  update(
    id: GcCmsSession['id'],
    payload: Partial<
      Omit<GcCmsSession, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<GcCmsSession | null> {
    const updatedEntity = this.sessionRepository.update(id, payload);
    if (!updatedEntity) {
      throw NOT_FOUND('session', { id });
    }
    return updatedEntity;
  }

  deleteById(id: GcCmsSession['id']): Promise<void> {
    return this.sessionRepository.deleteById(id);
  }

  deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    return this.sessionRepository.deleteByUserId(conditions);
  }

  deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: GcCmsSession['id'];
  }): Promise<void> {
    return this.sessionRepository.deleteByUserIdWithExclude(conditions);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // captilize first letter of the field name
    if (typeof this.sessionRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on session repository.`,
        field,
      );
    }

    const session = await this.sessionRepository[repoFunction](value);
    if (!session) {
      throw NOT_FOUND('session', { [field]: value });
    }
    return session;
  }
}
