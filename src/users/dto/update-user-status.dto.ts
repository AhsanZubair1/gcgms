import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';

import { UserVerificationStatus } from '@src/utils/enums/user-verification.enum';

export class UpdateUserStatusDto {
  @ApiProperty({ example: UserVerificationStatus.REJECTED })
  @IsEnum(UserVerificationStatus)
  status: UserVerificationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reasonIds?: string[];

  @ApiProperty({ example: 'fa251eeb-53fa-4fa1-b075-30240355a45b' })
  @IsString()
  mykadId: string;
}
