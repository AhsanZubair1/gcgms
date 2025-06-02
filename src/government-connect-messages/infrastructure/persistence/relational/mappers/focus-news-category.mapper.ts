import { FocusNewsCategory } from '@src/government-connect-messages/domain/focus-news-category';
import { FocusNewsCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/focus-news-categories.entity';

export class FopcusNewsCategoryMapper {
  static toDomain(raw: FocusNewsCategoryEntity): FocusNewsCategory {
    const domainEntity = new FocusNewsCategory();
    domainEntity.id = raw.id;
    domainEntity.value = raw.value;
    domainEntity.description = raw.description;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: FocusNewsCategory,
  ): FocusNewsCategoryEntity {
    const persistenceEntity = new FocusNewsCategoryEntity();

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
