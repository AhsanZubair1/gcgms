import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationRepository } from '@src/notifications/infrastructure/persistence/notification.abstract.repository';
import { GcCmsNotificationTokenEntity } from '@src/notifications/infrastructure/persistence/relational/entities/gc-cms-notification-token.entity';
import { GcCmsNotificationEntity } from '@src/notifications/infrastructure/persistence/relational/entities/gc-cms-notification.entity';
import { NotificationTokenEntity } from '@src/notifications/infrastructure/persistence/relational/entities/notification-token.entity';
import { NotificationEntity } from '@src/notifications/infrastructure/persistence/relational/entities/notification.entity';
import { RelationalNotificationRepository } from '@src/notifications/infrastructure/persistence/relational/repositories/notification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      NotificationTokenEntity,
      GcCmsNotificationEntity,
      GcCmsNotificationTokenEntity,
    ]),
  ],
  providers: [
    {
      provide: NotificationRepository,
      useClass: RelationalNotificationRepository,
    },
  ],
  exports: [NotificationRepository],
})
export class RelationalPersistenceModule {}
