import { GcCmsCategory } from '@src/categories/domain/gc-cms-category';
import { GcCmsCategoryEntity } from '@src/categories/infrastructure/persistence/relational/entities/gc-cms-category.entity';

export class GcCmsCategoryMapper {
  static toDomain(raw: GcCmsCategoryEntity): GcCmsCategory {
    const domainEntity = new GcCmsCategory();
    domainEntity.id = raw.id;
    domainEntity.value = raw.value;

    return domainEntity;
  }

  static toPersistence(domainEntity: GcCmsCategory): GcCmsCategoryEntity {
    const persistenceEntity = new GcCmsCategoryEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.value = domainEntity.value;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.is_active = domainEntity.isActive ?? true; // Default to true if not provided
    persistenceEntity.sort_order = domainEntity.sortOrder ?? 0;

    return persistenceEntity;
  }
}
