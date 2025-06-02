import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GcCmsUserNotification } from '@src/notifications/domain/gc-cms-notification';
import { GcCmsNotificationToken } from '@src/notifications/domain/gc-cms-notification-token';
import { Notification } from '@src/notifications/domain/notification';
import { NotificationToken } from '@src/notifications/domain/notification-token.domain';
import { NotificationRepository } from '@src/notifications/infrastructure/persistence/notification.abstract.repository';
import { GcCmsNotificationTokenEntity } from '@src/notifications/infrastructure/persistence/relational/entities/gc-cms-notification-token.entity';
import { GcCmsNotificationEntity } from '@src/notifications/infrastructure/persistence/relational/entities/gc-cms-notification.entity';
import { NotificationTokenEntity } from '@src/notifications/infrastructure/persistence/relational/entities/notification-token.entity';
import { NotificationEntity } from '@src/notifications/infrastructure/persistence/relational/entities/notification.entity';
import { GcCmsNotificationTokenMapper } from '@src/notifications/infrastructure/persistence/relational/mappers/gc-cms-notification-token.mapper';
import { GcCmsNotificationMapper } from '@src/notifications/infrastructure/persistence/relational/mappers/gc-cms-notification.mapper';
import { NotificationTokenMapper } from '@src/notifications/infrastructure/persistence/relational/mappers/notification-token-mapper';
import { NotificationMapper } from '@src/notifications/infrastructure/persistence/relational/mappers/notification.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class RelationalNotificationRepository
  implements NotificationRepository
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationTokenEntity)
    private readonly notificationTokenRepository: Repository<NotificationTokenEntity>,
    @InjectRepository(GcCmsNotificationEntity)
    private readonly gcCmsNotificationRepository: Repository<GcCmsNotificationEntity>,
    @InjectRepository(GcCmsNotificationTokenEntity)
    private readonly gcCmsNotificationTokenRepository: Repository<GcCmsNotificationTokenEntity>,
  ) {}

  async findAllNotifications(
    userId: string,
    {
      paginationOptions,
    }: {
      paginationOptions: IPaginationOptions;
    },
  ): Promise<GcCmsUserNotification[]> {
    const { limit, page } = paginationOptions;

    const notifications = await this.gcCmsNotificationRepository.find({
      where: { gc_cms_user: { id: userId } },
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });

    return notifications.map((notification) =>
      GcCmsNotificationMapper.toDomain(notification),
    );
  }

  async findById(id: string): Promise<GcCmsUserNotification | null> {
    const notification = await this.gcCmsNotificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    return GcCmsNotificationMapper.toDomain(notification);
  }

  async findTokenByUserId(
    userId: string,
  ): Promise<GcCmsUserNotification | null> {
    const notification = await this.gcCmsNotificationRepository.findOne({
      where: { gc_cms_user_id: userId },
    });

    if (!notification) {
      return null;
    }

    return GcCmsNotificationMapper.toDomain(notification);
  }

  async findAllUsersWithActiveTokens(
    skip: number,
    batch: number,
    categories: string[] = [],
    armedForces: string[] = [],
  ): Promise<Array<{ userid: string; device_token: string }>> {
    const query = this.notificationTokenRepository
      .createQueryBuilder('token')
      .innerJoin('token.user', 'user')
      .select(['token.device_token as device_token', 'user.id as userId'])
      .where('token.is_active = :isActive', { isActive: true })
      .andWhere('token.deleted_at IS NULL')
      .andWhere('user.deleted_at IS NULL');

    if (categories?.length > 0) {
      query.andWhere('user.category_id IN (:...categories)', { categories });
    }

    if (armedForces?.length > 0) {
      query.andWhere('user.armed_force_branch IN (:...armedForces)', {
        armedForces,
      });
    }

    const result = await query
      .orderBy('token.created_at', 'DESC')
      .skip(skip)
      .take(batch)
      .getRawMany();

    return result;
  }

  async findTokenByGcCmsUserId(
    userId: string,
  ): Promise<GcCmsNotificationToken | null> {
    const notification = await this.gcCmsNotificationTokenRepository.findOne({
      where: { gc_cms_user_id: userId, is_active: true },
    });

    if (!notification) {
      return null;
    }

    return GcCmsNotificationTokenMapper.toDomain(notification);
  }

  async findAllTokensByUserId(
    userId: string,
  ): Promise<NotificationToken[] | null> {
    const notification = await this.notificationTokenRepository.find({
      where: { user_id: userId, is_active: true },
    });

    if (!notification) {
      return null;
    }

    return notification.map((notification) =>
      NotificationTokenMapper.toDomain(notification),
    );
  }

  async findAllTokensByGcCmsUserId(
    userId: string,
  ): Promise<GcCmsNotificationToken[] | null> {
    const notification = await this.gcCmsNotificationTokenRepository.find({
      where: { gc_cms_user_id: userId, is_active: true },
    });

    if (!notification) {
      return null;
    }

    return notification.map((notification) =>
      GcCmsNotificationTokenMapper.toDomain(notification),
    );
  }

  async saveToken(notificationToken: GcCmsNotificationToken): Promise<void> {
    const notificationEntity =
      GcCmsNotificationTokenMapper.toPersistence(notificationToken);
    await this.gcCmsNotificationTokenRepository.save(notificationEntity);
  }

  async save(notification: Notification): Promise<void> {
    const notificationEntity = NotificationMapper.toPersistence(notification);
    await this.notificationRepository.save(notificationEntity);
  }

  async saveGcCmsNotification(
    notification: GcCmsUserNotification,
  ): Promise<void> {
    const notificationEntity =
      GcCmsNotificationMapper.toPersistence(notification);
    await this.gcCmsNotificationRepository.save(notificationEntity);
  }

  async markAllAsRead(userId: string): Promise<{ data: boolean }> {
    await this.gcCmsNotificationRepository.update(
      { gc_cms_user: { id: userId }, is_read: false },
      { is_read: true },
    );
    return { data: true };
  }

  async countNotifications(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { user: { id: userId } },
    });
  }

  async updateToken(
    id: string,
    notificationToken: GcCmsNotificationToken,
  ): Promise<void> {
    const notificationEntity =
      GcCmsNotificationTokenMapper.toPersistence(notificationToken);
    await this.notificationTokenRepository.update(id, notificationEntity);
  }

  async saveBulkNotifications(
    notifications: Array<{
      userId: string;
      title: { en: string; ms: string };
      metadata: any;
      message: { en: string; ms: string };
      type: string;
    }>,
  ): Promise<void> {
    // Convert all notifications to persistence format
    const notificationEntities = notifications.map((notification) =>
      NotificationMapper.toPersistence(notification),
    );

    // Use bulk insert for better performance
    await this.notificationRepository.insert(notificationEntities);
  }
}
