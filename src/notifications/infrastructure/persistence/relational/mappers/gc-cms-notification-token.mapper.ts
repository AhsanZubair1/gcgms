import { GcCmsNotificationToken } from '@src/notifications/domain/gc-cms-notification-token';
import { GcCmsNotificationTokenEntity } from '@src/notifications/infrastructure/persistence/relational/entities/gc-cms-notification-token.entity';

export class GcCmsNotificationTokenMapper {
  static toDomain(raw: GcCmsNotificationTokenEntity): GcCmsNotificationToken {
    const domainEntity = new GcCmsNotificationToken();
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
    domainEntity: GcCmsNotificationToken,
  ): GcCmsNotificationTokenEntity {
    const persistenceEntity = new GcCmsNotificationTokenEntity();

    persistenceEntity.device_id = domainEntity.deviceId;
    if (domainEntity.gcCmsUserId) {
      persistenceEntity.gc_cms_user_id = domainEntity.gcCmsUserId;
    }

    persistenceEntity.device_token = domainEntity.deviceToken;
    persistenceEntity.platform = domainEntity.platform;
    persistenceEntity.device_type = domainEntity.deviceType;
    persistenceEntity.app_version = domainEntity.appVersion;
    persistenceEntity.is_active = domainEntity.isActive;

    return persistenceEntity;
  }
}
