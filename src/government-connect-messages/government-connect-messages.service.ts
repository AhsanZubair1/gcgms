import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { ArmedForceBranchesService } from '@src/armed-force-branches/armed-force-branches.service';
import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { CategoriesService } from '@src/categories/categories.service';
import { UserCategory } from '@src/categories/enum/user-category.enum';
import { EVENTS } from '@src/common/constants';
import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { ContentCountResponseDto } from '@src/dashboards/dto/content-count.dto';
import { EventService } from '@src/event/event.service';
import { FilesS3Service } from '@src/files/infrastructure/uploader/s3/files.service';
import { Article } from '@src/government-connect-messages/domain/article.domain';
import { CreateContentDto } from '@src/government-connect-messages/dto/create-article.dto';
import { DateFilter } from '@src/government-connect-messages/dto/find-all-government-connect-messages.dto';
import { CmsUserCategoryEnum } from '@src/government-connect-messages/enum/cms-user-category.enum';
import { ContentPageEnum } from '@src/government-connect-messages/enum/content-page.enum';
import { MessageStatusEnum } from '@src/government-connect-messages/enum/message-status.enum';
import { MessageCategoryEnum } from '@src/government-connect-messages/enum/message-type.enum';
import { ErrorKey, ResponseKey } from '@src/i18n/translation-keys';
import { PermissionConst } from '@src/roles/consts/permission';
import { UsersService } from '@src/users/users.service';
import { PaginationResponseDto } from '@src/utils/dto/pagination-response.dto';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { GovernmentConnectMessage } from './domain/government-connect-message';
import { UpdateGovernmentConnectMessageDto } from './dto/update-government-connect-message.dto';
import { GovernmentConnectMessageAbstractRepository } from './infrastructure/persistence/government-connect-message.abstract.repository';

@Injectable()
export class GovernmentConnectMessagesService {
  constructor(
    private readonly governmentConnectMessageRepository: GovernmentConnectMessageAbstractRepository,
    private readonly userService: UsersService,
    private readonly fileService: FilesS3Service,
    private readonly userCategory: CategoriesService,
    private readonly armedForceBranch: ArmedForceBranchesService,
    private i18Service: I18nService,
    private readonly evntService: EventService,
  ) {}

  async newsWithPagination({
    paginationOptions,
    dateFilter,
    fromDate,
    toDate,
    status,
    search,
    authUser,
    contentPage,
    type,
  }: {
    paginationOptions: IPaginationOptions;
    dateFilter?: DateFilter;
    fromDate?: string;
    toDate?: string;
    status?: MessageStatusEnum;
    search?: string;
    authUser?: AuthUserType;
    contentPage: ContentPageEnum;
    type: MessageCategoryEnum;
  }): Promise<
    PaginationResponseDto<{
      id: string;
      messageId: number;
      title: string;
      status: string;
    }>
  > {
    let contentPageStatus;
    if (
      contentPage === ContentPageEnum.APPROVED &&
      authUser?.permissions?.some((permission) =>
        [
          PermissionConst.FOCUS_NEWS_APPROVE,
          PermissionConst.DIRECT_LINE_APPROVE,
          PermissionConst.MESSAGE_FROM_MINISTER_APPROVE,
        ].includes(permission),
      )
    ) {
      contentPageStatus = [
        MessageStatusEnum.REJECTED,
        MessageStatusEnum.SUBMITTED_FOR_APPROVAL,
        MessageStatusEnum.APPROVED,
      ];
    }
    if (
      authUser?.permissions?.some((permission) =>
        [
          PermissionConst.DIRECT_LINE_CREATE,
          PermissionConst.FOCUS_NEWS_CREATE,
          PermissionConst.MESSAGE_FROM_MINISTER_CREATE,
        ].includes(permission),
      )
    ) {
      contentPageStatus = [
        MessageStatusEnum.DRAFT,
        MessageStatusEnum.SUBMITTED_FOR_APPROVAL,
        MessageStatusEnum.APPROVED,
        MessageStatusEnum.REJECTED,
      ];
    }

    return this.governmentConnectMessageRepository.findAllFocusNewsWithPagination(
      {
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
      },
    );
  }

  async enhanceWithArmedForceBranches(res) {
    // Extract all unique branch IDs from all permissions
    const allBranchIds = [
      ...new Set(
        res.messagePermissions.flatMap((permission) =>
          permission.armedForceBranch
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id),
        ),
      ),
    ];

    const branches = await Promise.all(
      allBranchIds.map((item: string) => this.armedForceBranch.findOne(item)),
    );

    // Filter out null/undefined results and create a lookup map
    const branchMap = new Map(
      branches.filter((branch) => branch).map((branch) => [branch.id, branch]),
    );

    // Enhance each permission
    res.messagePermissions = res.messagePermissions.map((permission) => {
      const branchIds = permission.armedForceBranch
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id);

      const armedForceBranches = branchIds
        .map((id) => branchMap.get(id))
        .filter(Boolean);

      return {
        ...permission,
        userCategory: {
          ...permission.userCategory,
          armedForceBranches,
        },
      };
    });

    return res;
  }

  async findOne(
    id: GovernmentConnectMessage['id'],
    type: MessageCategoryEnum,
    authUser: AuthUserType,
  ) {
    const res = await this.governmentConnectMessageRepository.findById(
      id,
      type,
      authUser,
    );
    if (!res) return res;

    const processFile = async (obj: any, prop: string) => {
      if (obj?.[prop]) {
        obj[prop] = await this.fileService.getFileUrl(obj[prop]);
      }
    };
    await Promise.all([
      processFile(res.article, 'thumbnailUrl'),
      processFile(res.article, 'bannerImage'),
      processFile(res.video, 'videoUrl'),
      processFile(res.video, 'thumbnailUrl'),
    ]);
    let response;
    if (res.messagePermissions && res?.messagePermissions?.length > 0) {
      response = await this.enhanceWithArmedForceBranches(res);
    }

    return response ?? res;
  }

  async updateStatus(
    id: string,
    status: MessageStatusEnum,
    userId: string,
    category: string,
    role?: Array<string>,
  ): Promise<{ data: string }> {
    const message = await this.governmentConnectMessageRepository.updateStatus(
      id,
      status,
      userId,
      category,
    );

    await this.evntService.emitAsync(EVENTS.notifyGcCmsUser, {
      messageId: message.messageId,
      status: status,
      gcCmsUserId: message.createdBy,
      role: role,
    });

    if (status === MessageStatusEnum.APPROVED) {
      const armedForces: string[] = [];
      const categories: string[] = [];
      if (
        message.type === MessageCategoryEnum.DIRECT_LINE &&
        message.messagePermissions
      ) {
        console.log(message.messagePermissions[0].armedForceBranch);

        message?.messagePermissions.map((item) => {
          if (item.armedForceBranch) {
            armedForces.push(...item.armedForceBranch.split(','));
          }
          if (item.userCategory) {
            categories.push(item.userCategory.id);
          }
        });
      }

      await this.evntService.emitAsync(EVENTS.assetPublished, {
        moduleType: message.type,
        messageType: message.article ? 'Article' : 'Video',
        armedForces: armedForces,
        categories: categories,
      });
    }

    return { data: this.i18Service.translate(ResponseKey.PUBLISH) };
  }

  async update(
    id: GovernmentConnectMessage['id'],
    updateGovernmentConnectMessageDto: UpdateGovernmentConnectMessageDto,
  ) {
    const governmentConnectMessage =
      this.governmentConnectMessageRepository.update(
        id,
        updateGovernmentConnectMessageDto,
      );
    if (!governmentConnectMessage) {
      throw NOT_FOUND('Government connect message', { id });
    }
    return governmentConnectMessage;
  }

  async remove(id: GovernmentConnectMessage['id']) {
    await this.governmentConnectMessageRepository.remove(id);
    return { data: 'Deleted' };
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (
      typeof this.governmentConnectMessageRepository[repoFunction] !==
      'function'
    ) {
      throw UNPROCESSABLE_ENTITY(
        ErrorKey.METHOD_NOT_FOUND,
        field,
        undefined,
        'GovernmentConnectMessageRepository',
        repoFunction,
      );
    }

    const governmentConnectMessage =
      await this.governmentConnectMessageRepository[repoFunction](value);
    if (!governmentConnectMessage) {
      throw NOT_FOUND('Government connect message', { [field]: value });
    }
    return governmentConnectMessage;
  }

  async directLineLookup(authUser: AuthUserType) {
    const user = await this.userService.findGcCmsUserById(authUser.id);
    const allCategories = await this.userCategory.findAllWithPagination();
    const allBranches = await this.armedForceBranch.findAllWithPagination();
    if (
      user?.gcCmsCategory.value.en === CmsUserCategoryEnum.ADMIN ||
      user?.gcCmsCategory.value.en === CmsUserCategoryEnum.MINDEF_EMPLOY
    ) {
      return allCategories
        .filter(
          (category) =>
            category.value.en === UserCategory.MILITARY ||
            category.value.en === UserCategory.VETERANS ||
            category.value.en === UserCategory.MINDEF_EMPLOY,
        )
        .map((category) => ({
          value: category.value.en,
          id: category.id,
          branches:
            category.value.en === UserCategory.MINDEF_EMPLOY
              ? []
              : allBranches.map((branch) => ({
                  value: branch.value.en,
                  id: branch.id,
                })),
        }));
    }
    if (user?.gcCmsCategory.value.en === CmsUserCategoryEnum.ARMY) {
      allCategories
        .filter((category) => category.value.en === UserCategory.MILITARY)
        .map((category) => ({
          value: category.value.en,
          id: category.id,
          branches: allBranches
            .filter((branch) => branch.value.en === 'Army')
            .map((branch) => ({
              value: branch.value.en,
              id: branch.id,
            })),
        }));
    }
    if (user?.gcCmsCategory.value.en === CmsUserCategoryEnum.NAVY) {
      allCategories
        .filter((category) => category.value.en === UserCategory.MILITARY)
        .map((category) => ({
          value: category.value.en,
          id: category.id,
          branches: allBranches
            .filter((branch) => branch.value.en === 'Navy')
            .map((branch) => ({
              value: branch.value.en,
              id: branch.id,
            })),
        }));
    }
    if (user?.gcCmsCategory.value.en === CmsUserCategoryEnum.AIR_FORCE) {
      allCategories
        .filter((category) => category.value.en === UserCategory.MILITARY)
        .map((category) => ({
          value: category.value.en,
          id: category.id,
          branches: allBranches
            .filter((branch) => branch.value.en === 'Airforce')
            .map((branch) => ({
              value: branch.value.en,
              id: branch.id,
            })),
        }));
    }
    if (user?.gcCmsCategory.value.en === CmsUserCategoryEnum.PAT) {
      allCategories
        .filter((category) => category.value.en === UserCategory.MILITARY)
        .map((category) => ({
          value: category.value.en,
          id: category.id,
          branches: allBranches.map((branch) => ({
            value: branch.value.en,
            id: branch.id,
          })),
        }));
    }

    if (user?.gcCmsCategory.value.en === CmsUserCategoryEnum.JHAV) {
      allCategories
        .filter((category) => category.value.en === UserCategory.VETERANS)
        .map((category) => ({
          value: category.value.en,
          id: category.id,
          branches: allBranches.map((branch) => ({
            value: branch.value.en,
            id: branch.id,
          })),
        }));
    }
  }

  async createContent(
    createContentDto: CreateContentDto,
    userId: string,
  ): Promise<string> {
    await this.governmentConnectMessageRepository.createContent(
      createContentDto,
      userId,
    );

    const responseKeyMap = {
      [MessageStatusEnum.DRAFT]: ResponseKey.SAVE_AS_DRAFT,
      [MessageStatusEnum.PUBLISHED]: ResponseKey.PUBLISH,
      [MessageStatusEnum.SUBMITTED_FOR_APPROVAL]:
        ResponseKey.WAITING_FOR_APPROVAL,
    };

    const responseKey = responseKeyMap[createContentDto.status];
    return this.i18Service.translate(responseKey);
  }
  findAllFocusNewsCategoryWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.governmentConnectMessageRepository.findAllFocusNewCategoryWithPagination(
      {
        paginationOptions: {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
        },
      },
    );
  }

  getLatestArticles(): Promise<Article[]> {
    return this.governmentConnectMessageRepository.findLatestThreeFocusNewsArticles();
  }

  findContentCounts(
    range: 'week' | 'month' | 'today',
  ): Promise<ContentCountResponseDto[]> {
    return this.governmentConnectMessageRepository.findContentCounts(range);
  }
}
