import { GcCmsUserNotification } from '@src/notifications/domain/gc-cms-notification';
import { GcCmsNotificationEntity } from '@src/notifications/infrastructure/persistence/relational/entities/gc-cms-notification.entity';

export class GcCmsNotificationMapper {
  static toDomain(raw: GcCmsNotificationEntity): GcCmsUserNotification {
    const domainEntity = new GcCmsUserNotification();
    domainEntity.id = raw.id;
    domainEntity.gcCmsUserId = raw.gc_cms_user.id;
    domainEntity.type = raw.type;
    domainEntity.message = raw.message;
    domainEntity.isRead = raw.is_read;
    domainEntity.metadata = raw.metadata;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: GcCmsUserNotification,
  ): GcCmsNotificationEntity {
    const persistenceEntity = new GcCmsNotificationEntity();

    if (domainEntity.gcCmsUserId) {
      persistenceEntity.gc_cms_user_id = domainEntity.gcCmsUserId;
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
