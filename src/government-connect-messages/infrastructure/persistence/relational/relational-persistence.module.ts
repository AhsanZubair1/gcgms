import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GovernmentConnectMessageAbstractRepository } from '@src/government-connect-messages/infrastructure/persistence/government-connect-message.abstract.repository';
import { ArticleEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/article.entity';
import { FocusNewsCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/focus-news-categories.entity';
import { GcCmsUserCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/gc-cms-user-category.entity';
import { VideoEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/video.entity';

import { GovernmentConnectMessageEntity } from './entities/government-connect-message.entity';
import { GovernmentConnectMessageRelationalRepository } from './repositories/government-connect-message.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GovernmentConnectMessageEntity,
      GcCmsUserCategoryEntity,
      ArticleEntity,
      FocusNewsCategoryEntity,
      VideoEntity,
    ]),
  ],
  providers: [
    {
      provide: GovernmentConnectMessageAbstractRepository,
      useClass: GovernmentConnectMessageRelationalRepository,
    },
  ],
  exports: [GovernmentConnectMessageAbstractRepository],
})
export class RelationalGovernmentConnectMessagePersistenceModule {}
