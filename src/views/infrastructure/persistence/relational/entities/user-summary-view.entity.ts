import { ViewEntity, ViewColumn } from 'typeorm';

import { USER_SUMMARY_VIEW } from '@src/views/infrastructure/persistence/view.consts';

@ViewEntity(USER_SUMMARY_VIEW)
export class UserSummaryViewEntity {
  @ViewColumn()
  id: number;

  @ViewColumn()
  email: string;
}
