import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { GcCmsSession } from '@src/session/domain/session';
import { GcCmsSessionEntity } from '@src/session/infrastructure/persistence/relational/entities/session.entity';
import { GcCmsSessionMapper } from '@src/session/infrastructure/persistence/relational/mappers/session.mapper';
import { SessionAbstractRepository } from '@src/session/infrastructure/persistence/session.abstract.repository';
import { GcCmsUser } from '@src/users/domain/gc-cms-user';
import { NullableType } from '@src/utils/types/nullable.type';

@Injectable()
export class SessionRelationalRepository implements SessionAbstractRepository {
  constructor(
    @InjectRepository(GcCmsSessionEntity)
    private readonly sessionRepository: Repository<GcCmsSessionEntity>,
  ) {}

  async findById(id: GcCmsSession['id']): Promise<NullableType<GcCmsSession>> {
    const entity = await this.sessionRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    return entity ? GcCmsSessionMapper.toDomain(entity) : null;
  }

  async create(data: GcCmsSession): Promise<GcCmsSession> {
    const persistenceModel = GcCmsSessionMapper.toPersistence(data);
    const newEntity = await this.sessionRepository.save(
      this.sessionRepository.create(persistenceModel),
    );
    return GcCmsSessionMapper.toDomain(newEntity);
  }

  async update(
    id: GcCmsSession['id'],
    payload: Partial<
      Omit<GcCmsSession, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<GcCmsSession | null> {
    const entity = await this.sessionRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) return null;

    const updatedEntity = await this.sessionRepository.save(
      this.sessionRepository.create(
        GcCmsSessionMapper.toPersistence({
          ...GcCmsSessionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return GcCmsSessionMapper.toDomain(updatedEntity);
  }

  async deleteById(id: GcCmsSession['id']): Promise<void> {
    await this.sessionRepository.softDelete({
      id: Number(id),
    });
  }

  async deleteByUserId(conditions: { userId: GcCmsUser['id'] }): Promise<void> {
    await this.sessionRepository.delete({
      gc_cms_user: {
        id: conditions.userId,
      },
    });
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: GcCmsUser['id'];
    excludeSessionId: GcCmsSession['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      gc_cms_user: {
        id: conditions.userId,
      },
      id: Not(Number(conditions.excludeSessionId)),
    });
  }
}
