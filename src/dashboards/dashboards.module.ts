import { Module } from '@nestjs/common';

import { FilesS3Module } from '@src/files/infrastructure/uploader/s3/files.module';
import { GovernmentConnectMessagesModule } from '@src/government-connect-messages/government-connect-messages.module';
import { UsersModule } from '@src/users/users.module';

import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';

@Module({
  imports: [GovernmentConnectMessagesModule, UsersModule, FilesS3Module],
  controllers: [DashboardsController],
  providers: [DashboardsService],
  exports: [DashboardsService],
})
export class DashboardsModule {}
