import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FileType } from '@src/files/domain/file';

export class UpdateFileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({
    enum: Object.values(FileType),
    enumName: 'FileType',
    description: 'The type of the file',
    required: false,
  })
  @IsString()
  @IsEnum(FileType, { message: 'Invalid file type' })
  @IsOptional()
  type?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  eppId: string | null;
}
