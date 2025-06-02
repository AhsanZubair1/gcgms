import { ApiProperty } from '@nestjs/swagger';

import { Article } from '@src/government-connect-messages/domain/article.domain';
import { MessagePermission } from '@src/government-connect-messages/domain/message-permission';
import { Video } from '@src/government-connect-messages/domain/video.domain';
import { MessageCategoryEnum } from '@src/government-connect-messages/enum/message-type.enum';
import { GcCmsUserCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/gc-cms-user-category.entity';

export class GovernmentConnectMessage {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the government connect message',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The unique identifier of the government connect message',
  })
  messageId: number;

  @ApiProperty({
    enum: MessageCategoryEnum,
    description: 'The type of government connect message',
  })
  type: MessageCategoryEnum;

  @ApiProperty({
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'published', 'archived'],
    default: 'draft',
    description: 'The current status of the message',
  })
  status: string;

  @ApiProperty({
    type: Boolean,
    description: 'The current message is article or video',
  })
  isArticle: boolean;

  @ApiProperty({
    type: Date,
    description: 'The date when the message was created',
  })
  createdAt: string;

  @ApiProperty({
    type: Date,
    description: 'The date when the message was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'The ID of the associated video (if any)',
  })
  video: Video | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'The ID of the associated article (if any)',
  })
  article: Article | null;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description: 'The ID of the user who created the message',
  })
  createdBy: string | null;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description: 'The ID of the user who last updated the message',
  })
  updatedBy: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'The cms user category associated with the message',
  })
  cmsUserCategory: GcCmsUserCategoryEntity | null;

  @ApiProperty({
    type: MessagePermission,
    nullable: true,
    description: 'The cms user category associated with the message',
  })
  messagePermissions: MessagePermission[] | null;
}
