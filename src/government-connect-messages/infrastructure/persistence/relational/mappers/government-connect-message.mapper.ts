import { GovernmentConnectMessage } from '@src/government-connect-messages/domain/government-connect-message';
import { GovernmentConnectMessageEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/government-connect-message.entity';
import { ArticleMapper } from '@src/government-connect-messages/infrastructure/persistence/relational/mappers/article.mappper';
import { MessagePermissionMapper } from '@src/government-connect-messages/infrastructure/persistence/relational/mappers/message-permission.mapper';
import { VideoMapper } from '@src/government-connect-messages/infrastructure/persistence/relational/mappers/video.mapper';

export class GovernmentConnectMessageMapper {
  static toDomain(
    raw: GovernmentConnectMessageEntity,
  ): GovernmentConnectMessage {
    const domainEntity = new GovernmentConnectMessage();
    domainEntity.id = raw.id;
    domainEntity.type = raw.type;
    domainEntity.messageId = raw.message_id;
    domainEntity.status = raw.status;
    domainEntity.createdBy = raw.created_by;
    domainEntity.updatedBy = raw.updated_by;
    domainEntity.isArticle = raw.article ? true : false;
    domainEntity.createdAt = raw.created_at.toISOString();
    if (raw.messagePermissions) {
      domainEntity.messagePermissions = raw.messagePermissions?.map((item) =>
        MessagePermissionMapper.toDomain(item),
      );
    }

    if (raw.article) {
      domainEntity.article = ArticleMapper.toDomain(raw.article);
    }
    if (raw.video) {
      domainEntity.video = VideoMapper.toDomain(raw.video);
    }

    return domainEntity;
  }

  static toPersistence(
    domainEntity: GovernmentConnectMessage,
  ): GovernmentConnectMessageEntity {
    const persistenceEntity = new GovernmentConnectMessageEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.type = domainEntity.type;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.created_by = domainEntity.createdBy;
    persistenceEntity.updated_by = domainEntity.updatedBy;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
