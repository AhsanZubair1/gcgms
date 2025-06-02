import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { NOT_FOUND } from '@src/common/exceptions';
import { ContentCountResponseDto } from '@src/dashboards/dto/content-count.dto';
import { Article } from '@src/government-connect-messages/domain/article.domain';
import { FocusNewsCategory } from '@src/government-connect-messages/domain/focus-news-category';
import { GcCmsUserCategory } from '@src/government-connect-messages/domain/gc-cms-user-category.domain';
import { GovernmentConnectMessage } from '@src/government-connect-messages/domain/government-connect-message';
import {
  ContentTypeEnum,
  CreateContentDto,
} from '@src/government-connect-messages/dto/create-article.dto';
import { DateFilter } from '@src/government-connect-messages/dto/find-all-government-connect-messages.dto';
import { ContentPageEnum } from '@src/government-connect-messages/enum/content-page.enum';
import { MessageStatusEnum } from '@src/government-connect-messages/enum/message-status.enum';
import { MessageCategoryEnum } from '@src/government-connect-messages/enum/message-type.enum';
import { GovernmentConnectMessageAbstractRepository } from '@src/government-connect-messages/infrastructure/persistence/government-connect-message.abstract.repository';
import { ArticleEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/article.entity';
import { FocusNewsCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/focus-news-categories.entity';
import { GcCmsUserCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/gc-cms-user-category.entity';
import { GovernmentConnectMessageEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/government-connect-message.entity';
import { MessagePermissionEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/message-permission.entity';
import { VideoEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/video.entity';
import { ArticleMapper } from '@src/government-connect-messages/infrastructure/persistence/relational/mappers/article.mappper';
import { FopcusNewsCategoryMapper } from '@src/government-connect-messages/infrastructure/persistence/relational/mappers/focus-news-category.mapper';
import { GcCmsUserCategoryMapper } from '@src/government-connect-messages/infrastructure/persistence/relational/mappers/gc-cms-user.mapper';
import { GovernmentConnectMessageMapper } from '@src/government-connect-messages/infrastructure/persistence/relational/mappers/government-connect-message.mapper';
import { PermissionConst } from '@src/roles/consts/permission';
import { getDateRangeConfig } from '@src/utils/date-range-helper';
import { PaginationResponseDto } from '@src/utils/dto/pagination-response.dto';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class GovernmentConnectMessageRelationalRepository
  implements GovernmentConnectMessageAbstractRepository
{
  constructor(
    @InjectRepository(GovernmentConnectMessageEntity)
    private readonly governmentConnectMessageRepository: Repository<GovernmentConnectMessageEntity>,
    @InjectRepository(GcCmsUserCategoryEntity)
    private readonly gcsUserCategoryRepository: Repository<GcCmsUserCategoryEntity>,

    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(FocusNewsCategoryEntity)
    private readonly focusNewsCategpryRepo: Repository<FocusNewsCategoryEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAllUserCmsCategory(): Promise<GcCmsUserCategory[]> {
    const entities = await this.gcsUserCategoryRepository.find();
    return entities.map((entity) => GcCmsUserCategoryMapper.toDomain(entity));
  }
  async findAllFocusNewsWithPagination({
    paginationOptions,
    dateFilter,
    fromDate,
    toDate,
    status,
    contentPageStatus,
    search,
    authUser,
    type,
    contentPage,
  }: {
    paginationOptions: IPaginationOptions;
    dateFilter?: DateFilter;
    fromDate?: string;
    toDate?: string;
    status?: MessageStatusEnum;
    contentPageStatus: MessageStatusEnum[];
    search?: string;
    authUser?: AuthUserType;
    type: MessageCategoryEnum;
    contentPage: ContentPageEnum;
  }): Promise<
    PaginationResponseDto<{
      id: string;
      messageId: number;
      title: string;
      status: string;
    }>
  > {
    const queryBuilder = this.governmentConnectMessageRepository
      .createQueryBuilder('message')
      .select([
        'message.id',
        'article.title',
        'message.message_id',
        'video.title',
        'message.status',
        'message.created_at',
      ])
      .where('message.type = :type', { type: type })
      .leftJoin('message.article', 'article')
      .leftJoin('message.video', 'video');

    if (
      authUser?.permissions?.some((permission) =>
        [
          PermissionConst.DIRECT_LINE_CREATE,
          PermissionConst.FOCUS_NEWS_CREATE,
          PermissionConst.MESSAGE_FROM_MINISTER_CREATE,
        ].includes(permission),
      )
    ) {
      queryBuilder.andWhere('message.created_by = :userId', {
        userId: authUser.id,
      });
    }

    if (contentPageStatus.length) {
      queryBuilder.andWhere('message.status IN (:...contentPageStatus)', {
        contentPageStatus,
      });
    }

    if (status) {
      queryBuilder.andWhere('message.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR video.title LIKE :search OR message.message_id::text LIKE :search OR article.author LIKE :search OR video.speaker_name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply date filters
    if (dateFilter) {
      const currentDate = new Date();

      switch (dateFilter) {
        case DateFilter.TODAY:
          queryBuilder.andWhere(
            'DATE(message.created_at) = DATE(:currentDate)',
            {
              currentDate,
            },
          );
          break;
        case DateFilter.WEEK:
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
          queryBuilder.andWhere('message.created_at >= :startOfWeek', {
            startOfWeek,
          });
          break;
        case DateFilter.CUSTOM:
          if (fromDate && toDate) {
            // Parse dates as UTC midnight to avoid timezone conversion
            const fromDateUTC = new Date(`${fromDate}T00:00:00Z`);
            const toDateUTC = new Date(`${toDate}T23:59:59.999Z`);

            queryBuilder.andWhere(
              'message.created_at BETWEEN :fromDate AND :toDate',
              {
                fromDate: fromDateUTC,
                toDate: toDateUTC,
              },
            );
          }
          break;
      }
    }

    const totalCount = await queryBuilder.getCount();
    const pageNumber = paginationOptions.page;
    const pageLimit = paginationOptions.limit;
    const skip = (pageNumber - 1) * pageLimit;
    const from = skip + 1;
    const to = Math.min(skip + pageLimit, totalCount);
    const res = await queryBuilder.skip(skip).take(pageLimit).getMany();
    const hasNextPage = pageNumber * pageLimit < totalCount;

    return {
      data: res.map((focusNews) => {
        let status = focusNews.status;

        if (contentPage === ContentPageEnum.CREATE) {
          if (status === MessageStatusEnum.APPROVED) {
            status = MessageStatusEnum.PUBLISHED;
          }
        } else if (contentPage === ContentPageEnum.APPROVED) {
          if (status === MessageStatusEnum.SUBMITTED_FOR_APPROVAL) {
            status = MessageStatusEnum.PENDING;
          }
        }

        return {
          id: focusNews.id,
          messageId: focusNews.message_id,
          title: (focusNews.article?.title || focusNews.video?.title) ?? '',
          status: status, // Use the modified status
        };
      }),
      hasNextPage,
      pageNumber,
      pageLimit,
      totalRecords: totalCount,
      from,
      to,
    };
  }

  async findById(
    id: GovernmentConnectMessage['id'],
    type: MessageCategoryEnum,
    authUser?: AuthUserType,
  ): Promise<NullableType<GovernmentConnectMessage>> {
    const queryBuilder = this.governmentConnectMessageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.video', 'video')
      .leftJoinAndSelect('message.article', 'article')
      .leftJoinAndSelect('article.category', 'focusNewsCategory')
      .leftJoinAndSelect('message.messagePermissions', 'permission')
      .leftJoinAndSelect('permission.userCategory', 'userCategory')
      .where('message.type = :type', { type: type })
      .where('message.id = :id', { id });

    if (authUser) {
      if (
        authUser.permissions?.some((role) =>
          [
            'Focus News - Create',
            'Message from Minister - Create',
            'Direct Line - Create',
          ].includes(role),
        )
      ) {
        queryBuilder
          .andWhere('message.created_by = :userId', { userId: authUser.id })
          .andWhere('message.status IN (:...statuses)', {
            statuses: [
              MessageStatusEnum.DRAFT,
              MessageStatusEnum.PUBLISHED,
              MessageStatusEnum.SUBMITTED_FOR_APPROVAL,
              MessageStatusEnum.APPROVED,
            ],
          });
      }

      if (
        authUser.roles?.some((role) =>
          [
            'Content Moderator (Direct Line)',
            'Content Moderator (Focused News)',
            'Content Moderator (Message from Minister)',
          ].includes(role),
        )
      ) {
        queryBuilder.andWhere('message.status IN (:...statuses)', {
          statuses: [
            MessageStatusEnum.REJECTED,
            MessageStatusEnum.PUBLISHED,
            MessageStatusEnum.SUBMITTED_FOR_APPROVAL,
          ],
        });
      }

      // Map status for Content Moderator view
      const entity = await queryBuilder.getOne();
      if (
        entity &&
        authUser.permissions?.some((role) =>
          [
            'Message from Minister - Approve',
            'Focus News - Approve',
            'Direct Line - Approve',
          ].includes(role),
        )
      ) {
        if (entity.status === MessageStatusEnum.SUBMITTED_FOR_APPROVAL) {
          entity.status = 'PENDING' as any;
        }
      }

      return entity ? GovernmentConnectMessageMapper.toDomain(entity) : null;
    }
    const entity = await queryBuilder.getOne();
    if (entity?.status === MessageStatusEnum.SUBMITTED_FOR_APPROVAL) {
      entity.status = 'PENDING' as any;
    }
    return entity ? GovernmentConnectMessageMapper.toDomain(entity) : null;
  }

  async update(
    id: GovernmentConnectMessage['id'],
    payload: Partial<GovernmentConnectMessage>,
  ): Promise<GovernmentConnectMessage | null> {
    const entity = await this.governmentConnectMessageRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    await this.governmentConnectMessageRepository.update(
      id,
      GovernmentConnectMessageMapper.toPersistence({
        ...GovernmentConnectMessageMapper.toDomain(entity),
        ...payload,
      }),
    );
    return GovernmentConnectMessageMapper.toDomain(entity);
  }

  async remove(id: GovernmentConnectMessage['id']): Promise<void> {
    await this.governmentConnectMessageRepository.delete(id);
  }

  async createContent(createContentDto: CreateContentDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let article: ArticleEntity | null = null;
      let video: VideoEntity | null = null;

      if (createContentDto.contentType === ContentTypeEnum.ARTICLE) {
        article = queryRunner.manager.create(ArticleEntity, {
          title: createContentDto.title,
          url: createContentDto.url,
          author: createContentDto.author,
          publication_date: createContentDto.publicationDate,
          summary: createContentDto.summary,
          content: createContentDto.content,
          thumbnail_url: createContentDto.thumbnailUrl,
          banner_image: createContentDto.bannerImage,
          focus_news_category_id: createContentDto.focusNewsCategoryId,
          created_by: userId,
        });
        article = await queryRunner.manager.save(article);
      } else if (createContentDto.contentType === ContentTypeEnum.VIDEO) {
        video = queryRunner.manager.create(VideoEntity, {
          title: createContentDto.title,
          speaker_name: createContentDto.speakerName,
          publication_date: createContentDto.publicationDate,
          summary: createContentDto.summary,
          video_url: createContentDto.videoUrl,
          content: createContentDto.content,
          thumbnail_url: createContentDto.thumbnailUrl,
          duration: createContentDto.duration,
          created_by: userId,
        });
        video = await queryRunner.manager.save(video);
      } else {
        throw new Error('Unsupported content type');
      }

      const messageData: Partial<GovernmentConnectMessageEntity> = {
        status: createContentDto.status,
        type: createContentDto.messageType,
        created_by: userId,
        updated_by: userId,
      };

      if (article) {
        messageData.article = article;
      }
      if (video) {
        messageData.video = video;
      }

      const message = queryRunner.manager.create(
        GovernmentConnectMessageEntity,
        messageData,
      );

      const savedMessage = await queryRunner.manager.save(message);
      if (
        createContentDto.messageType === MessageCategoryEnum.DIRECT_LINE &&
        createContentDto.audience
      ) {
        for (const audienceItem of createContentDto.audience) {
          if (!audienceItem.userCategory) continue;

          // Skip if armed_force_branch is empty or contains no valid branches
          const armedForceBranches = audienceItem.armed_force_branch
            ? audienceItem.armed_force_branch
                .split(',')
                .map((b) => b.trim())
                .filter((b) => b)
            : [];

          if (armedForceBranches.length === 0) {
            continue; // Skip this iteration – nothing to insert
          }

          const permission = queryRunner.manager.create(
            MessagePermissionEntity,
            {
              message: savedMessage,
              userCategory: { id: audienceItem.userCategory },
              armed_force_branch: audienceItem.armed_force_branch,
            },
          );

          await queryRunner.manager.save(permission);
        }
      }

      await queryRunner.commitTransaction();
      return savedMessage;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async findAllFocusNewCategoryWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FocusNewsCategory[]> {
    const entities = await this.focusNewsCategpryRepo.find({
      where: {
        is_active: true, // Only fetch active categories
      },
      order: {
        sort_order: 'ASC',
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => FopcusNewsCategoryMapper.toDomain(entity));
  }

  async updateStatus(
    id: string,
    status: MessageStatusEnum,
    userId: string,
  ): Promise<GovernmentConnectMessage> {
    await this.governmentConnectMessageRepository.update(
      { id },
      { status, updated_by: userId },
    );

    const messageWithRelations = await this.governmentConnectMessageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.video', 'video')
      .leftJoinAndSelect('message.article', 'article')
      .leftJoinAndSelect('message.messagePermissions', 'permission')
      .leftJoinAndSelect('permission.userCategory', 'userCategory')
      .where('message.id = :id', { id })
      .getOne();

    if (!messageWithRelations) {
      throw NOT_FOUND('Message', { id });
    }

    return GovernmentConnectMessageMapper.toDomain(messageWithRelations);
  }

  async findLatestThreeFocusNewsArticles(): Promise<Article[]> {
    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .innerJoin(
        GovernmentConnectMessageEntity,
        'message',
        'message.article_id = article.id',
      )
      .where('message.type = :type', {
        type: MessageCategoryEnum.FOCUS_NEWS,
      })
      .andWhere('message.status = :status', {
        status: MessageStatusEnum.APPROVED,
      })
      .orderBy('message.created_at', 'DESC')
      .limit(3)
      .getMany();

    return articles.map(ArticleMapper.toDomain);
  }

  async findContentCounts(
    range: 'today' | 'week' | 'month',
  ): Promise<ContentCountResponseDto[]> {
    const {
      dateTruncFormat,
      interval,
      labelFormat,
      seriesRange,
      periodInterval,
      labelType,
    } = getDateRangeConfig(range);

    let query = `
    WITH date_series AS (
      SELECT generate_series(
        DATE_TRUNC('${seriesRange}', CURRENT_DATE - INTERVAL '${periodInterval}'),
        DATE_TRUNC('${seriesRange}', CURRENT_DATE),
        INTERVAL '${interval}'
      ) AS date_series
    )
    SELECT
    `;

    // Handle special formatting for week labels in month view
    if (labelType === 'week') {
      query += `
      'Week ' || (1 + EXTRACT(WEEK FROM DATE_TRUNC('week', ds.date_series)) - EXTRACT(WEEK FROM DATE_TRUNC('month', CURRENT_DATE))) AS label,
      `;
    } else {
      query += `
      TO_CHAR(ds.date_series, '${labelFormat}') AS label,
      `;
    }

    query += `
      COUNT(DISTINCT a.id)::text AS "articleCount",
      COUNT(DISTINCT v.id)::text AS "videoCount"
    FROM date_series ds
    LEFT JOIN "articles" a 
      ON DATE_TRUNC('${dateTruncFormat}', a.created_at) = DATE_TRUNC('${dateTruncFormat}', ds.date_series)
      AND a.created_at BETWEEN 
          (CURRENT_DATE - INTERVAL '${periodInterval}') AND CURRENT_DATE
    LEFT JOIN "videos" v 
      ON DATE_TRUNC('${dateTruncFormat}', v.created_at) = DATE_TRUNC('${dateTruncFormat}', ds.date_series)
      AND v.created_at BETWEEN 
          (CURRENT_DATE - INTERVAL '${periodInterval}') AND CURRENT_DATE
    `;

    if (labelType === 'week') {
      query += `
      GROUP BY DATE_TRUNC('week', ds.date_series), label
      ORDER BY DATE_TRUNC('week', ds.date_series)
      `;
    } else {
      query += `
      GROUP BY ds.date_series, label
      ORDER BY ds.date_series
      `;
    }

    const result = await this.governmentConnectMessageRepository.query(query);
    return result;
  }
}
