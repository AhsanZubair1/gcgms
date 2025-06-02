import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { ContentCountResponseDto } from '@src/dashboards/dto/content-count.dto';
import { Article } from '@src/government-connect-messages/domain/article.domain';
import { FocusNewsCategory } from '@src/government-connect-messages/domain/focus-news-category';
import { GcCmsUserCategory } from '@src/government-connect-messages/domain/gc-cms-user-category.domain';
import { GovernmentConnectMessage } from '@src/government-connect-messages/domain/government-connect-message';
import { CreateContentDto } from '@src/government-connect-messages/dto/create-article.dto';
import { DateFilter } from '@src/government-connect-messages/dto/find-all-government-connect-messages.dto';
import { ContentPageEnum } from '@src/government-connect-messages/enum/content-page.enum';
import { MessageStatusEnum } from '@src/government-connect-messages/enum/message-status.enum';
import { MessageCategoryEnum } from '@src/government-connect-messages/enum/message-type.enum';
import { PaginationResponseDto } from '@src/utils/dto/pagination-response.dto';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

export abstract class GovernmentConnectMessageAbstractRepository {
  abstract findAllFocusNewsWithPagination({
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
  >;

  abstract findById(
    id: GovernmentConnectMessage['id'],
    type: MessageCategoryEnum,
    authUser?: AuthUserType,
  ): Promise<NullableType<GovernmentConnectMessage>>;

  abstract updateStatus(
    id: string,
    status: MessageStatusEnum,
    userId: string,
    category: string,
  ): Promise<GovernmentConnectMessage>;
  abstract update(
    id: GovernmentConnectMessage['id'],
    payload: DeepPartial<GovernmentConnectMessage>,
  ): Promise<GovernmentConnectMessage | null>;

  abstract remove(id: GovernmentConnectMessage['id']): Promise<void>;

  abstract findAllUserCmsCategory(): Promise<GcCmsUserCategory[]>;

  abstract createContent(createContentDto: CreateContentDto, userId: string);
  abstract findLatestThreeFocusNewsArticles(): Promise<Article[]>;

  abstract findAllFocusNewCategoryWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FocusNewsCategory[]>;

  abstract findContentCounts(
    range: 'week' | 'month' | 'today',
  ): Promise<ContentCountResponseDto[]>;
}
