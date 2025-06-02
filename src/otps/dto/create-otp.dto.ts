import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateOtpDto {
  @ApiProperty({
    example: '+923110357070',
    description: 'Phone number to send OTP to',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format',
  })
  phoneNumber: string | null;

  @ApiProperty({
    example: '+923110357070',
    description: 'Phone number to send OTP to',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string | null;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP code (auto-generated)',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP code (auto-generated)',
    readOnly: true,
  })
  @IsOptional()
  @IsString()
  userId?: string | null;

  constructor() {
    // Auto-generate 6-digit OTP
    this.otp = Math.floor(100000 + Math.random() * 900000).toString();
  }
}
