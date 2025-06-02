import { GcCmsOtp } from '@src/otps/domain/otp';
import { GcCmsOtpEntity } from '@src/otps/infrastructure/persistence/relational/entities/otp.entity';

export class GcCmsOtpMapper {
  static toDomain(raw: GcCmsOtpEntity): GcCmsOtp {
    const domainEntity = new GcCmsOtp();
    domainEntity.id = raw.id;
    domainEntity.phoneNumber = raw.phone_number;
    domainEntity.email = raw.email;
    domainEntity.otp = raw.otp;
    domainEntity.expiresAt = raw.expires_at;
    domainEntity.isUsed = raw.is_used;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: GcCmsOtp): GcCmsOtpEntity {
    const persistenceEntity = new GcCmsOtpEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.phone_number = domainEntity.phoneNumber;
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.otp = domainEntity.otp;
    persistenceEntity.expires_at = domainEntity.expiresAt;
    persistenceEntity.is_used = domainEntity.isUsed;
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
