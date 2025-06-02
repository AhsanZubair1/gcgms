import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  HttpStatus,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';

import { UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { FileAbstractRepository } from '@src/files/infrastructure/persistence/file.abstract.repository';
import { ErrorKey } from '@src/i18n/translation-keys';

import { FileUploadDto } from './dto/file.dto';

@Injectable()
export class FilesS3PresignedService {
  private s3: S3Client;

  constructor(
    private readonly fileRepository: FileAbstractRepository,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: configService.get<string>('file.awsS3Region', { infer: true }),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('file.accessKeyId', {
          infer: true,
        }),
        secretAccessKey: configService.getOrThrow<string>(
          'file.secretAccessKey',
          {
            infer: true,
          },
        ),
      },
    });
  }

  async create(file: FileUploadDto): Promise<any> {
    if (!file) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.NOT_PRESENT, 'file');
    }

    if (!file.fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.INCORRECT, 'fileType');
    }

    if (
      file.fileSize >
      (this.configService.get('file.maxFileSize', {
        infer: true,
      }) || 0)
    ) {
      throw new PayloadTooLargeException({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        error: 'Payload Too Large',
        message: 'File too large',
      });
    }

    const key = `${randomStringGenerator()}.${file.fileName
      .split('.')
      .pop()
      ?.toLowerCase()}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow<string>('file.awsDefaultS3Bucket', {
        infer: true,
      }),
      Key: key,
      ContentLength: file.fileSize,
    });
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    //   const data = await this.fileRepository.create({
    //     path: key,
    //   });

    return {
      // file: data,
      uploadSignedUrl: signedUrl,
    };
  }
}
