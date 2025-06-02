import { Article } from '@src/government-connect-messages/domain/article.domain';
import { ArticleEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/article.entity';
import { FopcusNewsCategoryMapper } from '@src/government-connect-messages/infrastructure/persistence/relational/mappers/focus-news-category.mapper';

export class ArticleMapper {
  static toDomain(raw: ArticleEntity): Article {
    const domainEntity = new Article();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.url = raw.url;
    domainEntity.tags = raw.tags;
    domainEntity.author = raw.author;
    domainEntity.publicationDate = raw.publication_date;
    domainEntity.summary = raw.summary;
    domainEntity.createdBy = raw.created_by;
    domainEntity.updatedBy = raw.updated_by;
    domainEntity.content = raw.content;
    domainEntity.thumbnailUrl = raw.thumbnail_url ?? null;
    domainEntity.bannerImage = raw.banner_image;

    if (raw.category) {
      domainEntity.focusNewsCategory = FopcusNewsCategoryMapper.toDomain(
        raw.category,
      );
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Article): ArticleEntity {
    const persistenceEntity = new ArticleEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.title = domainEntity.title;
    persistenceEntity.url = domainEntity.url;
    persistenceEntity.author = domainEntity.author;
    persistenceEntity.publication_date = domainEntity.publicationDate;
    persistenceEntity.summary = domainEntity.summary;

    persistenceEntity.created_by = domainEntity.createdBy;
    persistenceEntity.updated_by = domainEntity.updatedBy;
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.thumbnail_url = domainEntity.thumbnailUrl;
    persistenceEntity.banner_image = domainEntity.bannerImage;

    persistenceEntity.focus_news_category_id = domainEntity.focusNewsCategoryId;

    return persistenceEntity;
  }
}
