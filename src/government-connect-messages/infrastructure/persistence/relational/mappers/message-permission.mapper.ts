import { CategoryMapper } from '@src/categories/infrastructure/persistence/relational/mappers/category.mapper';
import { MessagePermission } from '@src/government-connect-messages/domain/message-permission';
import { MessagePermissionEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/message-permission.entity';

export class MessagePermissionMapper {
  static toDomain(raw: MessagePermissionEntity): MessagePermission {
    const domainEntity = new MessagePermission();
    domainEntity.id = raw.id;
    domainEntity.armedForceBranch = raw.armed_force_branch;
    if (raw.userCategory) {
      domainEntity.userCategory = CategoryMapper.toDomain(raw.userCategory);
    }

    return domainEntity;
  }

  static toPersistence(
    domainEntity: MessagePermission,
  ): MessagePermissionEntity {
    const persistenceEntity = new MessagePermissionEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.armed_force_branch = domainEntity.armedForceBranch;
    persistenceEntity.createdAt = domainEntity.createdAt;

    if (domainEntity.userCategory) {
      persistenceEntity.userCategory = CategoryMapper.toPersistence(
        domainEntity.userCategory,
      );
    }

    return persistenceEntity;
  }
}
