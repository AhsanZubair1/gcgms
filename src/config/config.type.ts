import { AuthConfig } from '@src/auth/config/auth-config.type';
import { RedisConfig } from '@src/cache/config/redis-config.type';
import { DatabaseConfig } from '@src/database/config/database-config.type';
import { FileConfig } from '@src/files/config/file-config.type';
import { MailConfig } from '@src/mail/config/mail-config.type';
import { NotificationConfig } from '@src/notifications/config/notification-config.type';

import { AppConfig } from './app-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
  redis: RedisConfig;
  notification: NotificationConfig;
};
