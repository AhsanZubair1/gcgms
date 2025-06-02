import { GcCmsUserCategory } from '@src/government-connect-messages/domain/gc-cms-user-category.domain';
import { GcCmsUserCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/gc-cms-user-category.entity';

export class GcCmsUserCategoryMapper {
  static toDomain(raw: GcCmsUserCategoryEntity): GcCmsUserCategory {
    const domain = new GcCmsUserCategory();
    domain.id = raw.id;
    domain.value = raw.value;
    domain.description = raw.description ?? null;
    domain.isActive = raw.is_active;
    domain.sortOrder = raw.sort_order;

    return domain;
  }
}
