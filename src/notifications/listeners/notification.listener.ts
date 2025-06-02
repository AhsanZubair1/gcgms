import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENTS } from '@src/common/constants';
import { NotificationConstService } from '@src/notifications/notification.const';
import { NotificationsService } from '@src/notifications/notifications.service';

@Injectable()
export class NotificationListener {
  constructor(
    private readonly notificationSvc: NotificationsService,
    private readonly notificationConst: NotificationConstService,
  ) {}

  @OnEvent(EVENTS.userStatus)
  async handleUserRequect(event: any) {
    await this.notificationSvc.sendPush(
      event.userId,
      await this.notificationConst.userRequestRegistered(event),
    );
  }

  @OnEvent(EVENTS.assetPublished)
  async assetsPublish(event: any) {
    await this.notificationSvc.sendBulkPushNotifications(
      await this.notificationConst.assetApproved({
        messageType: event.messageType,
        moduleType: event.moduleType,
      }),
      event.categories,
      event.armedForces,
    );
  }

  @OnEvent(EVENTS.notifyGcCmsUser)
  async gcCmsUsernotification(event: any) {
    await this.notificationSvc.saveGcCmsUser(
      await this.notificationConst.gcCmsUserNotify({
        messageId: event.messageId,
        status: event.status,
      }),
      event.gcCmsUserId,
    );
  }
}
