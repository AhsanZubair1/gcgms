import { UserStatusReasons } from '@src/users/domain/user-status-reasons';
import { UserStatusReasonsEntity } from '@src/users/infrastructure/persistence/relational/entities/user-status-reasons.entity';

export class UserStatusReasonsMapper {
  static toDomain(raw: UserStatusReasonsEntity): UserStatusReasons {
    const domainEntity = new UserStatusReasons();
    domainEntity.id = raw.id;
    domainEntity.value = raw.value;
    domainEntity.description = raw.description;
    return domainEntity;
  }

  static toPersistence(
    domainEntity: UserStatusReasons,
  ): UserStatusReasonsEntity {
    const persistenceEntity = new UserStatusReasonsEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.value = domainEntity.value;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.is_active = domainEntity.isActive;
    persistenceEntity.sort_order = domainEntity.sortOrder;
    return persistenceEntity;
  }
}
