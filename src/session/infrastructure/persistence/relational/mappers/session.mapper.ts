import { GcCmsSession } from '@src/session/domain/session';
import { GcCmsSessionEntity } from '@src/session/infrastructure/persistence/relational/entities/session.entity';
import { GcCmsUserEntity } from '@src/users/infrastructure/persistence/relational/entities/gc-cms.user.entity';
import { GcCmsUserMapper } from '@src/users/infrastructure/persistence/relational/mappers/gc-cms-user.mapper';

export class GcCmsSessionMapper {
  static toDomain(raw: GcCmsSessionEntity): GcCmsSession {
    const domainEntity = new GcCmsSession();
    domainEntity.id = raw.id;
    if (raw.gc_cms_user) {
      domainEntity.gcCmsUser = GcCmsUserMapper.toDomain(raw.gc_cms_user);
    }
    domainEntity.hash = raw.hash;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;
    domainEntity.deletedAt = raw.deleted_at;
    return domainEntity;
  }

  static toPersistence(domainEntity: GcCmsSession): GcCmsSessionEntity {
    const user = new GcCmsUserEntity();
    user.id = domainEntity.gcCmsUser.id;

    const persistenceEntity = new GcCmsSessionEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.hash = domainEntity.hash;
    persistenceEntity.gc_cms_user = user;
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;
    persistenceEntity.deleted_at = domainEntity.deletedAt;

    return persistenceEntity;
  }
}
