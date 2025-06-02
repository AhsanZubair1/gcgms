import { Injectable } from '@nestjs/common';

import { EVENTS } from '@src/common/constants';
import { I18nTranslationService } from '@src/i18n/i18n.service';
import { ResponseKey } from '@src/i18n/translation-keys';
import { NotificationPayload } from '@src/notifications/dto/notification-payload';
import { NotificationTypeEnum } from '@src/notifications/enum/notification-type.enum';
import { UserVerificationStatus } from '@src/utils/enums/user-verification.enum';

@Injectable()
export class NotificationConstService {
  constructor(private readonly i18Service: I18nTranslationService) {}

  public async userRequestRegistered(data: any): Promise<NotificationPayload> {
    let status;
    switch (data.status) {
      case UserVerificationStatus.APPROVED:
        status = ResponseKey.USER_STATUS_APPROVED;
      case UserVerificationStatus.RESUBMISSION_REQUIRED:
        status = ResponseKey.USER_STATUS_RESUBMIT;
      default:
        status = ResponseKey.USER_STATUS_REJECTED;
    }
    return {
      title: await this.i18Service.translate(ResponseKey.USER_STATUS_TITLE),
      body: await this.i18Service.translate(status),
      type: EVENTS.userStatus,
      data: { ...data },
    };
  }
  public async assetApproved(data: any): Promise<NotificationPayload> {
    return {
      title: await this.i18Service.translate(ResponseKey.PUBLISH),
      body: await this.i18Service.translate(
        ResponseKey.ASSET_APPROVED_NOTIFICATION,
        {
          messageType: data.messageType,
          moduleType: data.moduleType,
        },
      ),
      type: NotificationTypeEnum.ASSET_PUBLISHED,
      data: { ...data },
    };
  }

  public async gcCmsUserNotify(data: any): Promise<NotificationPayload> {
    return {
      title: await this.i18Service.translate(ResponseKey.PUBLISH),
      body: await this.i18Service.translate(ResponseKey.ASSET_STATUS_UPDATE, {
        messageId: data.messageId,
        status: data.status,
      }),
      type: NotificationTypeEnum.ASSET_PUBLISHED,
      data: { ...data },
    };
  }
}
