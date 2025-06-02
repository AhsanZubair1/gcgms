import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';
import { I18nService } from 'nestjs-i18n';

import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
} from '@src/common/exceptions';
import { ErrorKey, ResponseKey } from '@src/i18n/translation-keys';
import notificationConfig from '@src/notifications/config/notification.config';
import { GcCmsUserNotification } from '@src/notifications/domain/gc-cms-notification';
import { Notification } from '@src/notifications/domain/notification';
import { NotificationToken } from '@src/notifications/domain/notification-token.domain';
import { NotificationPayload } from '@src/notifications/dto/notification-payload';
import { NotificationTokenDto } from '@src/notifications/dto/notification-token.dto';
import { NotificationRepository } from '@src/notifications/infrastructure/persistence/notification.abstract.repository';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

interface NotificationSendResult {
  successCount: number;
  responses: any[];
}

const FCM_MAX_TOKENS_PER_BATCH = 500;

@Injectable()
export class NotificationsService {
  private readonly app: firebase.app.App;

  constructor(
    private readonly repo: NotificationRepository,
    private readonly configSvc: ConfigService,
    private readonly i18Service: I18nService,
  ) {
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(notificationConfig()),
    });
  }

  async getAllNotifications(
    userId: string,
    { paginationOptions }: { paginationOptions: IPaginationOptions },
  ): Promise<GcCmsUserNotification[]> {
    this.validateUserId(userId);

    try {
      return await this.repo.findAllNotifications(userId, {
        paginationOptions: {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
        },
      });
    } catch (error) {
      throw INTERNAL_SERVER(
        ErrorKey.NOTIFICATION_FETCH_ERROR,
        undefined,
        error.message,
      );
    }
  }

  async markAsRead(id: string, isRead: boolean): Promise<void> {
    this.validateNotificationId(id);

    try {
      const notification = await this.findAndValidate('id', id);
      notification.isRead = isRead;
      await this.repo.saveGcCmsNotification(notification);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw INTERNAL_SERVER(
        ErrorKey.NOTIFICATION_UPDATE_ERROR,
        undefined,
        error.message,
      );
    }
  }

  async markAllRead(userId: string): Promise<{ data: boolean }> {
    this.validateUserId(userId);

    try {
      await this.repo.markAllAsRead(userId);
      return { data: true };
    } catch (error) {
      throw INTERNAL_SERVER(
        ErrorKey.NOTIFICATION_MARK_ALL_READ_ERROR,
        undefined,
        error.message,
      );
    }
  }

  async findAndValidate(
    field: string,
    value: string,
    fetchRelations = false,
  ): Promise<Promise<GcCmsUserNotification>> {
    if (!field || !value) {
      throw BAD_REQUEST(`${field} is required`, field);
    }

    const methodName = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`;

    if (typeof this.repo[methodName] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        ErrorKey.METHOD_NOT_FOUND,
        field,
        undefined,
        'NotificationRepository',
        methodName,
      );
    }

    try {
      const notification = await this.repo[methodName](value);
      if (!notification) {
        throw NOT_FOUND('Notification', { [field]: value });
      }
      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw INTERNAL_SERVER(
        ErrorKey.NOTIFICATION_FETCH_ERROR,
        undefined,
        error.message,
      );
    }
  }

  async countNotifications(userId: string): Promise<number> {
    this.validateUserId(userId);

    try {
      return await this.repo.countNotifications(userId);
    } catch (error) {
      throw INTERNAL_SERVER(
        ErrorKey.NOTIFICATION_COUNT_ERROR,
        undefined,
        error.message,
      );
    }
  }

  async acceptPushNotification(
    userId: string,
    input: NotificationTokenDto,
  ): Promise<{ data: string }> {
    const existingToken = await this.repo.findTokenByGcCmsUserId(userId);
    const tokenData = {
      gcCmsUserId: userId,
      ...input,
      isActive: true,
    };

    existingToken?.id
      ? await this.repo.updateToken(existingToken.id, tokenData)
      : await this.repo.saveToken(tokenData);

    return { data: 'notification enabled' };
  }

  async saveGcCmsUser(payload, gcCmsUserId) {
    const gcCmsUserNotification = {
      gcCmsUserId,
      title: { en: payload.title, ms: payload.title },
      metadata: payload.data,
      message: { en: payload.body, ms: payload.body },
      type: payload.type,
    };
    await this.repo.saveGcCmsNotification(gcCmsUserNotification);
  }

  async sendPush(
    userId: string,
    payload: NotificationPayload,
  ): Promise<{ data: string }> {
    const [activeUserTokens, gcCmsUserTokens] = await Promise.all([
      this.repo.findAllTokensByUserId(userId),
      this.repo.findAllTokensByGcCmsUserId(userId),
    ]);

    if (!activeUserTokens?.length && !gcCmsUserTokens?.length) {
      throw FORBIDDEN(ErrorKey.USER_ID_REQUIRED, 'user');
    }

    const baseNotification = {
      userId,
      title: { en: payload.title, ms: payload.title },
      metadata: payload.data,
      message: { en: payload.body, ms: payload.body },
      type: payload.type,
    };

    await this.processTokenGroups(
      userId,
      payload,
      activeUserTokens!,
      gcCmsUserTokens!,
      baseNotification,
    );
    return { data: this.i18Service.translate(ResponseKey.PROFILE_UPDATED) };
  }

  private async processTokenGroups(
    userId: string,
    payload: NotificationPayload,
    activeUserTokens: NotificationToken[],
    gcCmsUserTokens: any[],
    baseNotification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    const sendPromises: Promise<void>[] = [];

    if (activeUserTokens?.length) {
      sendPromises.push(
        this.processTokenGroup(activeUserTokens, payload, async () =>
          this.repo.save(baseNotification),
        ),
      );
    }

    if (gcCmsUserTokens?.length) {
      sendPromises.push(
        this.processTokenGroup(gcCmsUserTokens, payload, async () => {
          const gcCmsUser: Notification = {
            ...baseNotification,
          };
          await this.repo.save(gcCmsUser);
        }),
      );
    }

    await Promise.all(sendPromises);
  }

  private async processTokenGroup(
    tokens: any[],
    payload: NotificationPayload,
    onSuccess: () => Promise<void>,
  ): Promise<void> {
    try {
      const sendResult = await this.sendNotificationToTokens(
        tokens.map((token) => token.deviceToken),
        payload,
      );

      if (sendResult.successCount > 0) {
        await onSuccess();
      } else {
        throw FORBIDDEN(ErrorKey.NOTIFICATION_FETCH_ERROR, 'notification');
      }
    } catch (error) {
      throw FORBIDDEN(ErrorKey.NOTIFICATION_FETCH_ERROR, 'notification');
    }
  }

  private async sendNotificationToTokens(
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<NotificationSendResult> {
    try {
      const result = await this.app.messaging().sendEachForMulticast({
        notification: { title: payload.title, body: payload.body },
        data: payload.data,
        tokens,
      });
      return {
        successCount: result.successCount,
        responses: result.responses,
      };
    } catch (error) {
      return {
        successCount: 0,
        responses: tokens.map(() => ({ error })),
      };
    }
  }

  private handleFailedNotifications(responses: any[]): void {
    responses.forEach((response) => {
      if (
        response.error?.errorInfo?.code ===
        'messaging/registration-token-not-registered'
      ) {
        // Soft delete the invalid token from the database
        // this.notificationTokenRepo.softDelete(activeTokens[index].id);
      }
    });
  }

  async sendBulkPushNotifications(
    payload: NotificationPayload,
    categories: string[],
    armedForces: string[],
    batchSize = FCM_MAX_TOKENS_PER_BATCH,
  ): Promise<void> {
    let skip = 0;
    let hasMoreTokens = true;
    const maxIterations = 1000;
    let iterationCount = 0;

    while (hasMoreTokens && iterationCount < maxIterations) {
      iterationCount++;

      const tokenResults = await this.repo.findAllUsersWithActiveTokens(
        skip,
        batchSize,
        categories,
        armedForces,
      );

      hasMoreTokens = tokenResults.length > 0;
      if (!hasMoreTokens) break;

      try {
        const deviceTokens = tokenResults.map((t) => t.device_token);
        const sendResult = await this.sendBulkNotificationToTokens(
          deviceTokens,
          payload,
        );

        if (sendResult.successCount > 0) {
          const successfulUserIds = tokenResults
            .filter((_, index) => {
              const responseIndex = Math.floor(
                index / FCM_MAX_TOKENS_PER_BATCH,
              );
              return sendResult.responses[responseIndex]?.success ?? false;
            })
            .map((t) => t.userid);

          const notifications = successfulUserIds.map((userId) => ({
            userId,
            title: { en: payload.title, ms: payload.title },
            metadata: payload.data,
            message: { en: payload.body, ms: payload.body },
            type: payload.type,
          }));

          await this.repo.saveBulkNotifications(notifications);
        }
      } catch (error) {
        console.error(
          `Error sending batch ${skip / batchSize + 1}:`,
          error.message,
        );
        break;
      }

      skip += batchSize;
      if (tokenResults.length < batchSize) {
        hasMoreTokens = false;
      }
    }
  }

  private async sendBulkNotificationToTokens(
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<NotificationSendResult> {
    const tokenChunks = this.chunkArray(tokens, FCM_MAX_TOKENS_PER_BATCH);
    const results = await Promise.all(
      tokenChunks.map(async (chunk) => {
        try {
          const result = await this.app.messaging().sendEachForMulticast({
            notification: { title: payload.title, body: payload.body },
            data: payload.data,
            tokens: chunk,
          });
          return {
            successCount: result.successCount,
            failureCount: result.failureCount,
            responses: result.responses,
          };
        } catch (error) {
          return {
            successCount: 0,
            failureCount: chunk.length,
            responses: chunk.map(() => ({ success: false, error })),
          };
        }
      }),
    );

    return results.reduce(
      (acc, curr) => ({
        successCount: acc.successCount + curr.successCount,
        failureCount: acc.failureCount + curr.failureCount,
        responses: [...acc.responses, ...curr.responses],
      }),
      { successCount: 0, failureCount: 0, responses: [] },
    );
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private validateUserId(userId: string): void {
    if (!userId) {
      throw BAD_REQUEST(ErrorKey.USER_ID_REQUIRED, 'userId');
    }
  }

  private validateNotificationId(id: string): void {
    if (!id) {
      throw BAD_REQUEST(ErrorKey.NOTIFICATION_ID_REQUIRED, 'id');
    }
  }
}
