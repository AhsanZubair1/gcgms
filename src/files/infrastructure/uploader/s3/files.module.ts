import { S3Client } from '@aws-sdk/client-s3';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { Module } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import multerS3 from 'multer-s3';

import { UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { AllConfigType } from '@src/config/config.type';
import { RelationalFilePersistenceModule } from '@src/files/infrastructure/persistence/relational/relational-persistence.module';
import { I18nTranslationService } from '@src/i18n/i18n.service';
import { ErrorKey } from '@src/i18n/translation-keys';

import { FilesS3Controller } from './files.controller';
import { FilesS3Service } from './files.service';

const infrastructurePersistenceModule = RelationalFilePersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService, I18nTranslationService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const s3 = new S3Client({
          region: configService.get('file.awsS3Region', { infer: true }),
          credentials: {
            accessKeyId: configService.getOrThrow('file.accessKeyId', {
              infer: true,
            }),
            secretAccessKey: configService.getOrThrow('file.secretAccessKey', {
              infer: true,
            }),
          },
        });

        return {
          fileFilter: (request, file, callback) => {
            // Allow images, videos, and PDFs
            if (
              !file.originalname.match(
                /\.(jpg|jpeg|png|gif|pdf|mp4|mov|avi|mkv)$/i,
              )
            ) {
              return callback(
                UNPROCESSABLE_ENTITY(ErrorKey.INCORRECT, 'fileType'),
                false,
              );
            }

            callback(null, true);
          },
          storage: multerS3({
            s3: s3,
            bucket: configService.getOrThrow('file.awsDefaultS3Bucket', {
              infer: true,
            }),
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (request: any, file, callback) => {
              callback(
                null,
                `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`,
              );
            },
          }),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [FilesS3Controller],
  providers: [
    FilesS3Service,
    {
      provide: ImageAnnotatorClient,
      useValue: new ImageAnnotatorClient(),
    },
  ],
  exports: [FilesS3Service, ImageAnnotatorClient],
})
export class FilesS3Module {}
