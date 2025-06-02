import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';

import { UserCategory } from '@src/categories/enum/user-category.enum';
import { GenderEnum } from '@src/utils/enums/gender.enum';
import { lowerCaseTransformer } from '@src/utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', nullable: true })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'HR,ADMIN' })
  @ValidateIf(
    (o) =>
      o.userCategory === UserCategory.MINDEF_EMPLOY ||
      o.userCategory === UserCategory.MINDEF_EMPLOY_MS,
  )
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password?: string;

  @ApiProperty({ example: '+923110357070' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'ABC123456', description: 'Encrypted MILITARY ID' })
  @ValidateIf(
    (o) =>
      o.userCategory === UserCategory.MILITARY ||
      o.userCategory === UserCategory.MILITARY_MS,
  )
  @IsString()
  @IsNotEmpty()
  militaryId?: string;

  @ApiProperty({
    example: '123456789012',
    description: 'MyKad ID (Malaysian identity card number)',
    required: false,
  })
  @ValidateIf(
    (o) =>
      o.userCategory === UserCategory.MILITARY_FAMILY ||
      o.userCategory === UserCategory.MILITARY_FAMILY_MS,
  )
  @IsString()
  @IsNotEmpty()
  mykadId?: string;

  @ApiProperty({
    example: 'email',
    description: 'Preferred communication method (email, sms, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  preferredCommunicationMethod: string;

  @ApiProperty({ example: GenderEnum.MALE, enum: GenderEnum })
  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;

  @ApiProperty({ example: 'UUID', nullable: true })
  @ValidateIf(
    (o) =>
      o.userCategory === UserCategory.MILITARY ||
      o.userCategory === UserCategory.MILITARY_MS ||
      o.userCategory === UserCategory.VETERANS ||
      o.userCategory === UserCategory.VETERANS_MS,
  )
  @IsString()
  @IsNotEmpty()
  armedForceBranch?: string | null;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  biometricLogin?: boolean = false;

  @ApiProperty({ enum: UserCategory, description: 'User category' })
  @IsEnum(UserCategory)
  userCategory: UserCategory;

  @ApiPropertyOptional({
    type: String,
    description: 'MILITARY ID key',
    required: false,
  })
  @ValidateIf(
    (o) =>
      o.userCategory !== UserCategory.MILITARY_FAMILY ||
      o.userCategory !== UserCategory.MILITARY_FAMILY_MS,
  )
  @IsString()
  @IsNotEmpty()
  idImageS3Key?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Selfie ID key',
    required: false,
  })
  @ValidateIf(
    (o) =>
      o.userCategory !== UserCategory.MILITARY_FAMILY ||
      o.userCategory !== UserCategory.MILITARY_FAMILY_MS,
  )
  @IsString()
  @IsNotEmpty()
  selfieImageS3Key?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Referral code',
    example: 'REF123',
    nullable: true,
  })
  @ValidateIf((o) => o.userCategory === UserCategory.MILITARY_FAMILY)
  @IsNotEmpty()
  @IsString()
  referralCode?: string | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'Date of birth',
    example: '1990-01-01',
    nullable: true,
  })
  @IsOptional()
  dateOfBirth?: Date | null;

  @ApiPropertyOptional({
    type: String,
    description: 'UUID',
    nullable: false,
  })
  @IsNotEmpty()
  category: string;
}
