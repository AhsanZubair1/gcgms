import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { FileTypeEnum } from '@src/files/infrastructure/uploader/s3/enum/file-type.enum';

export class FileUploadDto {
  @IsEnum(FileTypeEnum)
  @IsNotEmpty()
  type: FileTypeEnum;

  @IsString()
  assignUrl: string;
}
