import { UserSummary } from '@src/views/domain/user-summary';
import { UserSummaryViewEntity } from '@src/views/infrastructure/persistence/relational/entities/user-summary-view.entity';

export class UserSummaryMapper {
  static toDomain(raw: UserSummaryViewEntity): UserSummary {
    const domainEntity = new UserSummary();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    return domainEntity;
  }
}
