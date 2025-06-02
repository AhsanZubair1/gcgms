import { Module } from '@nestjs/common';

import { ArmedForceBranchesModule } from '@src/armed-force-branches/armed-force-branches.module';
import { CategoriesModule } from '@src/categories/categories.module';
import { FilesS3Module } from '@src/files/infrastructure/uploader/s3/files.module';
import { UsersModule } from '@src/users/users.module';

import { GovernmentConnectMessagesController } from './government-connect-messages.controller';
import { GovernmentConnectMessagesService } from './government-connect-messages.service';
import { RelationalGovernmentConnectMessagePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalGovernmentConnectMessagePersistenceModule,
    UsersModule,
    FilesS3Module,
    CategoriesModule,
    ArmedForceBranchesModule,
  ],
  controllers: [GovernmentConnectMessagesController],
  providers: [GovernmentConnectMessagesService],
  exports: [
    GovernmentConnectMessagesService,
    RelationalGovernmentConnectMessagePersistenceModule,
  ],
})
export class GovernmentConnectMessagesModule {}
