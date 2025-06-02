import path from 'path';

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nModule, HeaderResolver } from 'nestjs-i18n';

import { AllConfigType } from '@src/config/config.type';

import { I18nTranslationService } from './i18n.service';

@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const rootDir = process.cwd();
        const i18nPath = path.join(rootDir, 'src/i18n/');
        return {
          fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
            infer: true,
          }),
          loaderOptions: {
            path: i18nPath,
            watch: true,
            includeSubfolders: true,
            jsonIndent: 2,
            filePattern: '*.json',
            format: 'json',
          },
          typesOutputPath: path.join(rootDir, 'src/i18n/i18n.generated.ts'),
          logging: true,
        };
      },
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [I18nTranslationService],
  exports: [I18nTranslationService],
})
export class I18nTranslationModule {}
