import { ApiProperty } from '@nestjs/swagger';

import { MultiLingual, MultiLingualDto } from '@src/common/types/multi-lingual';

export class GcCmsUserNotification {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Notification UUID',
    example: '9f8b7c00-1234-4d7f-8a12-b1c77d0b26d1',
  })
  id?: string;

  @ApiProperty({
    type: String,
    description: 'User ID this notification belongs to',
    example: 'd2d52fae-e1e2-4e85-b55d-fc1f0dff3b1b',
  })
  gcCmsUserId: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Type of notification',
    example: 'ORDER_UPDATE',
  })
  type: string | null;

  @ApiProperty({
    type: () => MultiLingualDto,
    description: 'Notification title',
  })
  title: MultiLingual;

  @ApiProperty({
    type: () => MultiLingualDto,
    description: 'Notification message',
  })
  message: MultiLingual;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the notification has been read',
    example: false,
  })
  isRead?: boolean;

  @ApiProperty({
    type: Date,
    description: 'When the notification was created',
    example: '2025-04-10T10:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    type: Object,
    nullable: true,
    description:
      'Additional metadata for the notification (e.g., order_id, announcement_id)',
    example: { order_id: 1234, announcement_id: 'abcd' },
  })
  metadata: Record<string, string | number | boolean | null> | null;
}
