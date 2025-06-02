// create-content.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { IsValidContentTypeCombination } from '@src/government-connect-messages/dto/validators/content-type.validator';
import { MessageStatusEnum } from '@src/government-connect-messages/enum/message-status.enum';
import { MessageCategoryEnum } from '@src/government-connect-messages/enum/message-type.enum';

export enum ContentTypeEnum {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
}

export class AudienceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userCategory: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  armed_force_branch: string;
}

export class CreateContentDto {
  @ApiProperty({ enum: MessageCategoryEnum })
  @IsEnum(MessageCategoryEnum)
  @IsNotEmpty()
  @IsValidContentTypeCombination()
  messageType: MessageCategoryEnum;

  @ApiProperty({ enum: ContentTypeEnum })
  @IsEnum(ContentTypeEnum)
  @IsNotEmpty()
  contentType: ContentTypeEnum;

  // Common fields
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  summary?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.contentType === ContentTypeEnum.VIDEO)
  @IsNotEmpty()
  @IsString()
  thumbnailUrl?: string;

  // Article specific fields
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.contentType === ContentTypeEnum.ARTICLE)
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.contentType === ContentTypeEnum.ARTICLE)
  @IsString()
  @IsNotEmpty()
  bannerImage?: string;

  // Video specific fields
  @ApiProperty({ required: false })
  @ValidateIf((o) => o.contentType === ContentTypeEnum.VIDEO)
  @IsString()
  @IsNotEmpty()
  videoUrl?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.contentType === ContentTypeEnum.VIDEO)
  @IsString()
  @IsOptional()
  speakerName?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.contentType === ContentTypeEnum.VIDEO)
  @IsString()
  @IsOptional()
  duration?: string;

  // Common metadata
  @ApiProperty({
    example: '2025-05-19T18:33:29.716Z',
    description: 'The publication date in ISO format',
    required: false,
  })
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  @IsNotEmpty()
  publicationDate?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MessageStatusEnum)
  status: MessageStatusEnum;

  @ApiProperty({ type: [AudienceDto] })
  @ValidateIf((o) => o.messageType === MessageCategoryEnum.DIRECT_LINE)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AudienceDto)
  audience: AudienceDto[];

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.contentType === ContentTypeEnum.ARTICLE)
  @IsUUID()
  @IsNotEmpty()
  focusNewsCategoryId?: string;
}
