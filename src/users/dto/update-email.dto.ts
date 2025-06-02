import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({
    description: 'test@gmail.com',
    required: false,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
