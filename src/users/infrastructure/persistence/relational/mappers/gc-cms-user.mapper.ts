import { GcCmsCategoryMapper } from '@src/categories/infrastructure/persistence/relational/mappers/gc-cms-category.mapper';
import { RolesMapper } from '@src/roles/infrastructure/persistence/relational/mappers/roles.mapper';
import { GcCmsUser } from '@src/users/domain/gc-cms-user';
import { GcCmsUserEntity } from '@src/users/infrastructure/persistence/relational/entities/gc-cms.user.entity';

export class GcCmsUserMapper {
  static toDomain(raw: GcCmsUserEntity): GcCmsUser {
    const user = new GcCmsUser();
    user.id = raw.id;
    user.firstName = raw.first_name;
    user.lastName = raw.last_name;
    user.email = raw.email;
    user.phoneNumber = raw.phone_number;
    user.password = raw.password;
    user.lastLogin = raw.last_login;
    user.status = raw.status;
    if (raw.gc_cms_roles) {
      user.gcCmsRoles = raw.gc_cms_roles
        .filter((userRole) => userRole.role)
        .map((userRole) => RolesMapper.toDomain(userRole.role));
    }

    user.profilePicture = raw.profile_picture?.path;
    user.profilePictureKey = raw.profile_picture?.path;

    if (raw.gc_cms_category) {
      user.gcCmsCategory = GcCmsCategoryMapper.toDomain(raw.gc_cms_category);
    }
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    return user;
  }

  static toPersistence(user: GcCmsUser): GcCmsUserEntity {
    const entity = new GcCmsUserEntity();
    if (user.id) {
      entity.id = user.id;
    }
    entity.first_name = user.firstName;
    entity.last_name = user.lastName;
    entity.email = user.email;
    entity.phone_number = user.phoneNumber;
    entity.password = user.password;
    entity.last_login = user.lastLogin;
    entity.status = user.status;
    entity.profile_picture_id = user.profilePictureId;

    if (user?.gcCmsCategory?.id) {
      entity.gc_cms_category_id = user?.gcCmsCategory.id;
    }
    return entity;
  }
}
