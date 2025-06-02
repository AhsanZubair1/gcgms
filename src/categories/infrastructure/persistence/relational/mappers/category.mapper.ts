import { Category } from '@src/categories/domain/category';
import { CategoryEntity } from '@src/categories/infrastructure/persistence/relational/entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: CategoryEntity): Category {
    const domainEntity = new Category();
    domainEntity.id = raw.id;
    domainEntity.value = raw.value;
    domainEntity.description = raw.description;

    return domainEntity;
  }

  static toPersistence(domainEntity: Category): CategoryEntity {
    const persistenceEntity = new CategoryEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.value = domainEntity.value;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.is_active = domainEntity.isActive ?? true; // Default to true if not provided
    persistenceEntity.sort_order = domainEntity.sortOrder ?? 0; // Default to 0 if not provided

    return persistenceEntity;
  }
}
