import { Permission } from '@src/roles/domain/permission';
import { PermissionsEntity } from '@src/roles/infrastructure/persistence/relational/entities/permission.entity';

export class PermissionMapper {
  static toDomain(raw: PermissionsEntity): Permission {
    const domainEntity = new Permission();
    domainEntity.id = raw.id;
    domainEntity.module = raw.module;
    if (raw.action) {
      domainEntity.action = raw.action;
    }
    return domainEntity;
  }

  static toPersistence(domain: Permission): PermissionsEntity {
    const entity = new PermissionsEntity();
    if (domain.id) entity.id = domain.id;
    entity.module = domain.module;
    entity.action = domain.action;
    return entity;
  }
}
