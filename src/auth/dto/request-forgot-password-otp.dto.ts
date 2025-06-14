import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}
