import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { AllConfigType } from '@src/config/config.type';
import { FileResponseDto } from '@src/files/infrastructure/uploader/s3/dto/file-response.dto';
import { ErrorKey } from '@src/i18n/translation-keys';

import { FileTypeEnum } from './enum/file-type.enum';

@Injectable()
export class FilesS3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.s3 = new S3Client({
      region: this.configService.get('file.awsS3Region', { infer: true }),
      credentials: {
        accessKeyId: this.configService.getOrThrow('file.accessKeyId', {
          infer: true,
        }),
        secretAccessKey: this.configService.getOrThrow('file.secretAccessKey', {
          infer: true,
        }),
      },
    });
    this.bucket = this.configService.getOrThrow('file.awsDefaultS3Bucket', {
      infer: true,
    });
  }

  async getFileUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 300000 });
  }

  private getTargetFolder(type: FileTypeEnum): string {
    switch (type) {
      case FileTypeEnum.PROFILE:
        return 'profile';
      case FileTypeEnum.VIDEO:
        return 'video';
      case FileTypeEnum.ARTICLE:
        return 'article';
      default:
        return 'other';
    }
  }

  async create(
    file: Express.MulterS3.File,
    type: FileTypeEnum,
    assignUrl: string = 'false',
  ): Promise<FileResponseDto> {
    if (!file) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.NOT_PRESENT, 'file');
    }

    if (!type) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.NOT_PRESENT, 'type');
    }

    const originalKey = file.key;
    const folder = this.getTargetFolder(type);
    const newKey = `government-connect/${folder}/${originalKey}`;

    try {
      await this.s3.send(
        new CopyObjectCommand({
          Bucket: this.bucket,
          CopySource: `/${this.bucket}/${originalKey}`,
          Key: newKey,
        }),
      );
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: originalKey,
        }),
      );
      const resp: FileResponseDto = { key: newKey };
      if (assignUrl === 'true') {
        resp.uploadSignedUrl = await this.getFileUrl(newKey);
      }

      return resp;
    } catch (error) {
      try {
        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: originalKey,
          }),
        );
      } catch (cleanupError) {}
      throw UNPROCESSABLE_ENTITY(ErrorKey.NOT_PRESENT, 'file');
    }
  }
}
