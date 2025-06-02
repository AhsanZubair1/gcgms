import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { GcCmsUserNotification } from '@src/notifications/domain/gc-cms-notification';
import { NotificationTokenDto } from '@src/notifications/dto/notification-token.dto';
import { AuthUser } from '@src/utils/decorators/auth.decorator';

import { Notification } from './domain/notification';
import { FindAllNotificationsDto } from './dto/find-all-notifications.dto';
import { markAsReadDto } from './dto/mark-one-read.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOkResponse({
    type: [Notification],
  })
  async getAllNotifications(
    @AuthUser() user: AuthUserType,
    @Query() query: FindAllNotificationsDto,
  ): Promise<GcCmsUserNotification[]> {
    return this.notificationsService.getAllNotifications(user.id, {
      paginationOptions: {
        page: query?.page ?? 1,
        limit: query?.limit ?? 10,
      },
    });
  }

  async markAsRead(
    @Param('id') id: string,
    @Body() dto: markAsReadDto,
  ): Promise<void> {
    return this.notificationsService.markAsRead(id, dto.isRead);
  }

  @Post('mark-all-read')
  @ApiOkResponse({
    type: Boolean,
  })
  async markAllRead(
    @AuthUser() user: AuthUserType,
  ): Promise<{ data: boolean }> {
    return this.notificationsService.markAllRead(user.id);
  }

  @Get('count')
  @ApiOkResponse({
    type: Number,
    description:
      'Returns the total count of notifications for the authenticated user',
  })
  async countNotifications(@AuthUser() user: AuthUserType): Promise<number> {
    return this.notificationsService.countNotifications(user.id);
  }

  @Post('accept')
  async acceptNotifications(
    @AuthUser() user: AuthUserType,
    @Body() dto: NotificationTokenDto,
  ): Promise<{ data: string }> {
    return this.notificationsService.acceptPushNotification(user.id, dto);
  }
}
