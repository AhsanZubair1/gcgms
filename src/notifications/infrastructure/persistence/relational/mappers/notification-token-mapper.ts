import { NotificationToken } from '@src/notifications/domain/notification-token.domain';
import { NotificationTokenEntity } from '@src/notifications/infrastructure/persistence/relational/entities/notification-token.entity';

export class NotificationTokenMapper {
  static toDomain(raw: NotificationTokenEntity): NotificationToken {
    const domainEntity = new NotificationToken();
    domainEntity.id = raw.id;
    domainEntity.deviceId = raw.device_id;
    domainEntity.deviceToken = raw.device_token;
    domainEntity.platform = raw.platform;
    domainEntity.deviceType = raw.device_type;
    domainEntity.appVersion = raw.app_version;
    domainEntity.isActive = raw.is_active;
    domainEntity.lastActiveAt = raw.last_active_at;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: NotificationToken,
  ): NotificationTokenEntity {
    const persistenceEntity = new NotificationTokenEntity();

    persistenceEntity.device_id = domainEntity.deviceId;
    if (domainEntity.userId) {
      persistenceEntity.user_id = domainEntity.userId;
    }

    persistenceEntity.device_token = domainEntity.deviceToken;
    persistenceEntity.platform = domainEntity.platform;
    persistenceEntity.device_type = domainEntity.deviceType;
    persistenceEntity.app_version = domainEntity.appVersion;
    persistenceEntity.is_active = domainEntity.isActive;

    return persistenceEntity;
  }
}
