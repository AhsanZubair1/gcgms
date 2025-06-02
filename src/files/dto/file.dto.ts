import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FileType } from '@src/files/domain/file';

export class FileDto {
  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty({
    enum: Object.values(FileType),
    enumName: 'FileType',
    description:
      'The type of the file (e.g., SELFIE, ID_CARD, SALARY_SLIP, BANK_STATEMENT, UTILITY_BILL)',
  }) // FIX: Use `Object.values()`
  @IsString()
  @IsEnum(FileType, { message: 'Invalid file type' })
  type: string;

  @IsOptional()
  userId: string | null;

  @IsOptional()
  eppId: string | null;
}
