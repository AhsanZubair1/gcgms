import { ArmedForceBranch } from '@src/armed-force-branches/domain/armed-force-branch';
import { ArmedForceBranchEntity } from '@src/armed-force-branches/infrastructure/persistence/relational/entities/armed-force-branch.entity';

export class ArmedForceBranchMapper {
  static toDomain(raw: ArmedForceBranchEntity): ArmedForceBranch {
    const domainEntity = new ArmedForceBranch();
    domainEntity.id = raw.id;
    domainEntity.value = raw.value;
    domainEntity.description = raw.description;
    return domainEntity;
  }

  static toPersistence(domainEntity: ArmedForceBranch): ArmedForceBranchEntity {
    const persistenceEntity = new ArmedForceBranchEntity();
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
