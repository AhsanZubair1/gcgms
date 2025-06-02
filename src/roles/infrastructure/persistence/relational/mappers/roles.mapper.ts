import { Roles } from '@src/roles/domain/roles';
import { RolesEntity } from '@src/roles/infrastructure/persistence/relational/entities/roles.entity';

import { PermissionMapper } from './permission.mapper';

export class RolesMapper {
  static toDomain(raw: RolesEntity): Roles {
    const domainEntity = new Roles();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    if (Array.isArray(raw.permissions)) {
      domainEntity.permissions = raw.permissions.map(PermissionMapper.toDomain);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Roles): RolesEntity {
    const persistenceEntity = new RolesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.is_active = domainEntity.isActive;
    persistenceEntity.sort_order = domainEntity.sortOrder;
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
