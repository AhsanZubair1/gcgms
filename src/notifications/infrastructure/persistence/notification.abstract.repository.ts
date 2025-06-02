import { GcCmsUserNotification } from '@src/notifications/domain/gc-cms-notification';
import { GcCmsNotificationToken } from '@src/notifications/domain/gc-cms-notification-token';
import { Notification } from '@src/notifications/domain/notification';
import { NotificationToken } from '@src/notifications/domain/notification-token.domain';
import { User } from '@src/users/domain/user';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

export abstract class NotificationRepository {
  abstract findAllNotifications(
    userId: string,
    options: { paginationOptions: IPaginationOptions },
  ): Promise<GcCmsUserNotification[]>;

  abstract findTokenByUserId(
    userId: string,
  ): Promise<GcCmsUserNotification | null>;
  abstract findTokenByGcCmsUserId(
    userId: string,
  ): Promise<GcCmsNotificationToken | null>;

  abstract saveToken(notificationToken: GcCmsNotificationToken): Promise<void>;

  abstract updateToken(
    id: string,
    notificationToken: GcCmsNotificationToken,
  ): Promise<void>;

  abstract findAllTokensByUserId(
    userId: string,
  ): Promise<NotificationToken[] | null>;

  abstract findAllTokensByGcCmsUserId(
    userId: string,
  ): Promise<NotificationToken[] | null>;

  abstract findById(
    id: Notification['id'],
  ): Promise<GcCmsUserNotification | null>;
  abstract save(notification: Notification): Promise<void>;
  abstract saveGcCmsNotification(
    notification: GcCmsUserNotification,
  ): Promise<void>;

  abstract markAllAsRead(userId: User['id']): Promise<{ data: boolean }>;
  abstract countNotifications(userId: User['id']): Promise<number>;

  abstract findAllUsersWithActiveTokens(
    skip: number,
    batch: number,
    categories: string[],
    armedForces: string[],
  ): Promise<Array<{ userid: string; device_token: string }>>;

  abstract saveBulkNotifications(
    notifications: Array<{
      userId: string;
      title: { en: string; ms: string };
      metadata: any;
      message: { en: string; ms: string };
      type: string;
    }>,
  ): Promise<void>;
}
