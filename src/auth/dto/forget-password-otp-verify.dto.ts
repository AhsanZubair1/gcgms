import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordOtpVerifyDto {
  @ApiProperty({
    example: 'ahsanzubairzubair@gmail.com',
    description: 'email to send OTP to',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP code (auto-generated)',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
