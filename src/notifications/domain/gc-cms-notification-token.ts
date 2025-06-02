import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { PlatFormEnum } from '@src/notifications/enum/platform.enum';

export class GcCmsNotificationToken {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Notification token UUID',
    example: '6e8f4b3a-2c7d-4a1f-8e3b-5d6c7e8f9a0b',
  })
  id?: string;

  @ApiProperty({
    type: String,
    description: 'Device identifier',
    example: 'device-123456789',
  })
  deviceId: string;

  @ApiProperty({
    type: String,
    description: 'Unique push notification token for the device',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  deviceToken: string;

  @ApiProperty({
    enum: PlatFormEnum,
    description: 'Platform of the device',
    example: 'IOS',
  })
  platform: PlatFormEnum;

  @ApiHideProperty()
  gcCmsUserId?: string;

  @ApiProperty({
    type: String,
    description: 'Type/Model of the device',
    example: 'iPhone 13 Pro',
  })
  deviceType: string;

  @ApiProperty({
    type: String,
    description: 'App version installed on the device',
    example: '1.2.3',
  })
  appVersion: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the token is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: Date,
    description: 'When the token was last used/active',
    example: '2025-04-15T14:30:00.000Z',
  })
  lastActiveAt?: Date;
}
