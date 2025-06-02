import { FileType } from '@src/files/domain/file';
import { FileDto } from '@src/files/dto/file.dto';
import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';

export class FileMapper {
  static toDomain(raw: FileEntity): FileType {
    const domainEntity = new FileType();
    domainEntity.id = raw.id;
    domainEntity.path = raw.path;
    domainEntity.type = raw.type;
    if (raw.user_id) {
      domainEntity.userId = raw.user_id;
    }
    if (raw.epp_id) {
      domainEntity.userId = raw.epp_id;
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: FileDto): FileEntity {
    const persistenceEntity = new FileEntity();
    persistenceEntity.path = domainEntity.path;
    persistenceEntity.type = domainEntity.type;
    if (domainEntity.userId) {
      persistenceEntity.user_id = domainEntity.userId;
    }
    if (domainEntity.eppId) {
      persistenceEntity.epp_id = domainEntity.eppId;
    }
    return persistenceEntity;
  }
}
