import { ArmedForceBranchMapper } from '@src/armed-force-branches/infrastructure/persistence/relational/mappers/armed-force-branch.mapper';
import { CategoryMapper } from '@src/categories/infrastructure/persistence/relational/mappers/category.mapper';
import { NotificationMapper } from '@src/notifications/infrastructure/persistence/relational/mappers/notification.mapper';
import { User } from '@src/users/domain/user';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.fullName = raw.full_name;
    domainEntity.gender = raw.gender;
    domainEntity.organization = raw.organization;
    domainEntity.dateOfBirth = raw.date_of_birth;
    domainEntity.profileImage = raw.profile_image;
    domainEntity.phoneNumber = raw.phone_number;
    domainEntity.preferredCommunicationMethod =
      raw.preferred_communication_method;

    // Military-related fields
    domainEntity.militaryId = raw.military_id;
    domainEntity.mykadId = raw.mykad_id;
    if (raw.armed_force_branch) {
      domainEntity.armedForceBranch = ArmedForceBranchMapper.toDomain(
        raw.armed_force_branch,
      );
    }

    if (raw.category) {
      domainEntity.category = CategoryMapper.toDomain(raw.category);
    }
    if (Array.isArray(raw.photos) && raw.photos.length > 0) {
      const assignPhotoId = (type) =>
        raw?.photos?.find((p) => p.type === type)?.path ?? null;

      domainEntity.profileImage = assignPhotoId('PROFILE_IMAGE');
      domainEntity.selfie = assignPhotoId('SELFIE');
      domainEntity.militaryIdImage = assignPhotoId('MILITRY_ID');
      domainEntity.profileImageKey = domainEntity.profileImage;
      domainEntity.selfieKey = domainEntity.selfie;
      domainEntity.militaryIdImageKey = domainEntity.militaryIdImage;
    }

    domainEntity.verificationStatus = raw.verification_status;
    domainEntity.verificationToken = raw.verification_token;
    domainEntity.referralCode = raw.referral_code;
    domainEntity.deletedAt = raw.deleted_at;
    domainEntity.createdAt = raw.created_at.toDateString();
    if (Array.isArray(raw.notifications)) {
      domainEntity.notifications = raw.notifications.map((notification) =>
        NotificationMapper.toDomain(notification),
      );
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    const persistenceEntity = new UserEntity();

    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.full_name = domainEntity.fullName;
    persistenceEntity.organization = domainEntity.organization;
    persistenceEntity.gender = domainEntity.gender;
    persistenceEntity.date_of_birth = domainEntity.dateOfBirth;
    persistenceEntity.profile_image = domainEntity.profileImage;
    persistenceEntity.phone_number = domainEntity.phoneNumber;
    persistenceEntity.preferred_communication_method =
      domainEntity.preferredCommunicationMethod;
    persistenceEntity.military_id = domainEntity.militaryId;
    persistenceEntity.mykad_id = domainEntity.mykadId;

    if (domainEntity.armedForceBranch) {
      persistenceEntity.armed_force_branch =
        ArmedForceBranchMapper.toPersistence(domainEntity.armedForceBranch);
    }
    if (domainEntity.category) {
      persistenceEntity.category = CategoryMapper.toPersistence(
        domainEntity.category,
      );
    }

    persistenceEntity.verification_status = domainEntity.verificationStatus;
    persistenceEntity.verification_token = domainEntity.verificationToken;
    persistenceEntity.referral_code = domainEntity.referralCode;
    persistenceEntity.deleted_at = domainEntity.deletedAt;

    return persistenceEntity;
  }
}
