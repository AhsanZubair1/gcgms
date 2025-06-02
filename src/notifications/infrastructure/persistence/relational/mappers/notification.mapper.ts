import { Notification } from '@src/notifications/domain/notification';
import { NotificationEntity } from '@src/notifications/infrastructure/persistence/relational/entities/notification.entity';

export class NotificationMapper {
  static toDomain(raw: NotificationEntity): Notification {
    const domainEntity = new Notification();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.user.id;
    domainEntity.type = raw.type;
    domainEntity.message = raw.message;
    domainEntity.isRead = raw.is_read;
    domainEntity.metadata = raw.metadata;

    return domainEntity;
  }

  static toPersistence(domainEntity: Notification): NotificationEntity {
    const persistenceEntity = new NotificationEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    if (domainEntity.userId) {
      persistenceEntity.user_id = domainEntity.userId;
    }
    persistenceEntity.type = domainEntity.type;
    persistenceEntity.message = domainEntity.message;
    if (domainEntity.isRead) {
      persistenceEntity.is_read = domainEntity.isRead;
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.metadata = domainEntity.metadata;

    return persistenceEntity;
  }
}
