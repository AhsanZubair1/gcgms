import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import { CacheModule } from '@src/cache/cache.module';
import redisConfig from '@src/cache/config/redis.config';
import { EventModule } from '@src/event/event.module';
import { HomeModule } from '@src/home/home.module';
import { I18nExceptionFilter } from '@src/i18n/i18n.filter';
import { LoggingsModule } from '@src/loggings/loggings.module';
import { NotificationsModule } from '@src/notifications/notifications.module';

import { ArmedForceBranchesModule } from './armed-force-branches/armed-force-branches.module';
import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
import { CategoriesModule } from './categories/categories.module';
import appConfig from './config/app.config';
import { DashboardsModule } from './dashboards/dashboards.module';
import databaseConfig from './database/config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { EncryptionsModule } from './encryptions/encryptions.module';
import fileConfig from './files/config/file.config';
import { FilesModule } from './files/files.module';
import { GovernmentConnectMessagesModule } from './government-connect-messages/government-connect-messages.module';
import { I18nTranslationModule } from './i18n/i18n.module';
import mailConfig from './mail/config/mail.config';
import { MailModule } from './mail/mail.module';
import { MailerModule } from './mailer/mailer.module';
import { OtpsModule } from './otps/otps.module';
import { RolesModule } from './roles/roles.module';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';
import { TypeOrmExceptionsFilter } from './utils/database-exception.filter';
import { ViewsModule } from './views/views.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

@Module({
  imports: [
    DashboardsModule,
    RolesModule,
    GovernmentConnectMessagesModule,
    HomeModule,
    LoggingsModule,
    ArmedForceBranchesModule,
    CategoriesModule,
    NotificationsModule,
    EncryptionsModule,
    EventModule,
    OtpsModule,
    ViewsModule,
    I18nTranslationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,

        redisConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    UsersModule,
    FilesModule,
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    CacheModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: I18nExceptionFilter,
    },
  ],
})
export class AppModule {}
