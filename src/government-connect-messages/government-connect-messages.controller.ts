import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { FindAllCategoriesDto } from '@src/categories/dto/find-all-categories.dto';
import { FocusNewsCategory } from '@src/government-connect-messages/domain/focus-news-category';
import { CreateContentDto } from '@src/government-connect-messages/dto/create-article.dto';
import { UpdateMessageStatusDto } from '@src/government-connect-messages/dto/update-message-status.dto';
import { ContentPageEnum } from '@src/government-connect-messages/enum/content-page.enum';
import { MessageCategoryEnum } from '@src/government-connect-messages/enum/message-type.enum';
import { PermissionConst } from '@src/roles/consts/permission';
import { Permissions } from '@src/roles/roles.decorator';
import { RolesGuard } from '@src/roles/roles.guard';
import { AuthUser } from '@src/utils/decorators/auth.decorator';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@src/utils/infinity-pagination';

import { GovernmentConnectMessage } from './domain/government-connect-message';
import { FindAllGovernmentConnectMessagesDto } from './dto/find-all-government-connect-messages.dto';
import { UpdateGovernmentConnectMessageDto } from './dto/update-government-connect-message.dto';
import { GovernmentConnectMessagesService } from './government-connect-messages.service';

@ApiTags('Governmentconnectmessages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'government-connect-messages',
  version: '1',
})
export class GovernmentConnectMessagesController {
  constructor(
    private readonly governmentConnectMessagesService: GovernmentConnectMessagesService,
  ) {}

  @Get('/direct-line')
  @Permissions(PermissionConst.DIRECT_LINE_CREATE)
  @UseGuards(RolesGuard)
  async findAllDirectLine(
    @Query() query: FindAllGovernmentConnectMessagesDto,
    @AuthUser() authUser: AuthUserType,
  ) {
    return this.getMessages(
      query,
      authUser,
      MessageCategoryEnum.DIRECT_LINE,
      ContentPageEnum.CREATE,
    );
  }

  @Get('/direct-line/approved')
  @Permissions(PermissionConst.DIRECT_LINE_APPROVE)
  @UseGuards(RolesGuard)
  async findAllDirectLineApproved(
    @Query() query: FindAllGovernmentConnectMessagesDto,
    @AuthUser() authUser: AuthUserType,
  ) {
    return this.getMessages(
      query,
      authUser,
      MessageCategoryEnum.DIRECT_LINE,
      ContentPageEnum.APPROVED,
    );
  }

  @Get('/minister-messages')
  @Permissions(PermissionConst.MESSAGE_FROM_MINISTER_CREATE)
  @UseGuards(RolesGuard)
  async ministerMessages(
    @Query() query: FindAllGovernmentConnectMessagesDto,
    @AuthUser() authUser: AuthUserType,
  ) {
    return this.getMessages(
      query,
      authUser,
      MessageCategoryEnum.MINISTER,
      ContentPageEnum.CREATE,
    );
  }

  @Get('/minister-messages/approved')
  @Permissions(PermissionConst.MESSAGE_FROM_MINISTER_APPROVE)
  @UseGuards(RolesGuard)
  async ministerMessagesApproved(
    @Query() query: FindAllGovernmentConnectMessagesDto,
    @AuthUser() authUser: AuthUserType,
  ) {
    return this.getMessages(
      query,
      authUser,
      MessageCategoryEnum.MINISTER,
      ContentPageEnum.APPROVED,
    );
  }

  @Get('/focus-news')
  @Permissions(PermissionConst.FOCUS_NEWS_CREATE)
  @UseGuards(RolesGuard)
  async focusNews(
    @Query() query: FindAllGovernmentConnectMessagesDto,
    @AuthUser() authUser: AuthUserType,
  ) {
    return this.getMessages(
      query,
      authUser,
      MessageCategoryEnum.FOCUS_NEWS,
      ContentPageEnum.CREATE,
    );
  }

  @Get('/focus-news/approved')
  @Permissions(PermissionConst.FOCUS_NEWS_APPROVE)
  @UseGuards(RolesGuard)
  async focusNewsApproved(
    @Query() query: FindAllGovernmentConnectMessagesDto,
    @AuthUser() authUser: AuthUserType,
  ) {
    return this.getMessages(
      query,
      authUser,
      MessageCategoryEnum.FOCUS_NEWS,
      ContentPageEnum.APPROVED,
    );
  }

  private async getMessages(
    query: FindAllGovernmentConnectMessagesDto,
    authUser: AuthUserType,
    type: MessageCategoryEnum,
    contentPage: ContentPageEnum,
  ) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return this.governmentConnectMessagesService.newsWithPagination({
      paginationOptions: { page, limit },
      dateFilter: query.dateFilter,
      fromDate: query.fromDate,
      toDate: query.toDate,
      status: query.status,
      search: query.search,
      authUser,
      type,
      contentPage,
    });
  }
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: GovernmentConnectMessage,
  })
  update(
    @Param('id') id: string,
    @Body()
    updateGovernmentConnectMessageDto: UpdateGovernmentConnectMessageDto,
  ) {
    return this.governmentConnectMessagesService.update(
      id,
      updateGovernmentConnectMessageDto,
    );
  }

  @Get('focus/:id')
  @Permissions('Focus News - Create', 'Focus News - Approve')
  @UseGuards(RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: GovernmentConnectMessage,
  })
  findOne(@Param('id') id: string, @AuthUser() authUser: AuthUserType) {
    return this.governmentConnectMessagesService.findOne(
      id,
      MessageCategoryEnum.FOCUS_NEWS,
      authUser,
    );
  }

  @Get('minister/:id')
  @Permissions(
    'Message from Minister - Create',
    'Message from Minister - Approve',
  )
  @UseGuards(RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: GovernmentConnectMessage,
  })
  findOneMinister(@Param('id') id: string, @AuthUser() authUser: AuthUserType) {
    return this.governmentConnectMessagesService.findOne(
      id,
      MessageCategoryEnum.MINISTER,
      authUser,
    );
  }

  @Get('direct/:id')
  @Permissions('Direct Line - Approve', 'Direct Line - Create')
  @UseGuards(RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: GovernmentConnectMessage,
  })
  findOneDirect(@Param('id') id: string, @AuthUser() authUser: AuthUserType) {
    return this.governmentConnectMessagesService.findOne(
      id,
      MessageCategoryEnum.DIRECT_LINE,
      authUser,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.governmentConnectMessagesService.remove(id);
  }

  @Get('/directline/lookup')
  directLineLookup(@AuthUser() authUser: AuthUserType) {
    return this.governmentConnectMessagesService.directLineLookup(authUser);
  }

  @Post('/content')
  createContent(
    @Body() createContentDto: CreateContentDto,
    @AuthUser() user: AuthUserType,
  ): Promise<string> {
    return this.governmentConnectMessagesService.createContent(
      createContentDto,
      user.id,
    );
  }

  @Get('/news/category')
  @ApiOkResponse({
    type: InfinityPaginationResponse(FocusNewsCategory),
  })
  async findAllFocusNewscategory(
    @Query() query: FindAllCategoriesDto,
  ): Promise<InfinityPaginationResponseDto<FocusNewsCategory>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.governmentConnectMessagesService.findAllFocusNewsCategoryWithPagination(
        {
          paginationOptions: {
            page,
            limit,
          },
        },
      ),
      { page, limit },
    );
  }

  @Patch(':id/status')
  @Permissions(
    'Direct Line - Approve',
    'Message from Minister - Approve',
    'Focus News - Approve',
  )
  @UseGuards(RolesGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateMessageStatusDto: UpdateMessageStatusDto,
    @AuthUser() authUser: AuthUserType,
  ) {
    return this.governmentConnectMessagesService.updateStatus(
      id,
      updateMessageStatusDto.status,
      authUser.id,
      authUser.category,
      authUser.roles,
    );
  }
}
