import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { PlatFormEnum } from '@src/notifications/enum/platform.enum';

export class NotificationTokenDto {
  @ApiProperty({
    type: String,
    example: '6e8f4b3a-2c7d-4a1f-8e3b-5d6c7e8f9a0b',
  })
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty({
    type: String,
    example: '6e8f4b3a-2c7d-4a1f-8e3b-5d6c7e8f9a0b',
  })
  @IsNotEmpty()
  @IsString()
  deviceType: string;

  @ApiProperty({
    type: String,
    example: '6e8f4b3a-2c7d-4a1f-8e3b-5d6c7e8f9a0b',
  })
  @IsNotEmpty()
  @IsString()
  deviceToken: string;

  @ApiProperty({
    enum: PlatFormEnum,
    description: 'Platform of the device',
    example: 'IOS',
  })
  @IsNotEmpty()
  @IsEnum(PlatFormEnum)
  platform: PlatFormEnum;

  @ApiProperty({
    type: String,
    description: 'App version installed on the device',
    example: '1.2.3',
  })
  @IsNotEmpty()
  @IsString()
  appVersion: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the token is currently active',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
