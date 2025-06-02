import { Module } from '@nestjs/common';

import { RelationalPersistenceModule } from '@src/notifications/infrastructure/persistence/relational/relational-persistence.module';
import { NotificationListener } from '@src/notifications/listeners/notification.listener';
import { NotificationConstService } from '@src/notifications/notification.const';
import { NotificationsController } from '@src/notifications/notifications.controller';
import { NotificationsService } from '@src/notifications/notifications.service';

@Module({
  imports: [RelationalPersistenceModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationListener,
    NotificationConstService,
  ],
  exports: [NotificationsService, RelationalPersistenceModule],
})
export class NotificationsModule {}
