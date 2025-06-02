import { QueryBuilder } from '@src/database/utils/query-builder';
import { UserSummary } from '@src/views/domain/user-summary';
import { UserSummaryViewEntity } from '@src/views/infrastructure/persistence/relational/entities/user-summary-view.entity';

export abstract class ViewsAbstractRepository {
  abstract getUsersSummaryView(): QueryBuilder<UserSummaryViewEntity>;
  abstract getUsersSummary(): Promise<UserSummary[]>;
}
