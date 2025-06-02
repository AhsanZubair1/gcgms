import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class markAsReadDto {
  @ApiProperty({
    type: Boolean,
    description: 'Whether to mark the notification as read or unread',
    example: true,
  })
  @IsBoolean()
  isRead: boolean;
}
