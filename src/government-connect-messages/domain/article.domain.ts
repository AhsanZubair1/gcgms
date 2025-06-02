import { ApiProperty } from '@nestjs/swagger';

import { FocusNewsCategory } from '@src/government-connect-messages/domain/focus-news-category';

export class Article {
  @ApiProperty({
    type: Number,
    description: 'The unique identifier of the article',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The title of the article',
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'The URL of the article',
    uniqueItems: true,
  })
  url: string;

  @ApiProperty({
    type: [String],
    description: 'Tags associated with the article',
    nullable: true,
  })
  tags: string[] | null;

  @ApiProperty({
    type: String,
    description: 'The author of the article',
    maxLength: 255,
  })
  author: string;

  @ApiProperty({
    type: Date,
    description: 'The publication date of the article',
    nullable: true,
  })
  publicationDate: Date | null;

  @ApiProperty({
    type: String,
    description: 'A summary of the article',
    nullable: true,
  })
  summary: string | null;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description: 'The ID of the user who created the article',
  })
  createdBy: string | null;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description: 'The ID of the user who last updated the article',
  })
  updatedBy: string | null;

  @ApiProperty({
    type: String,
    description: 'The content of the article',
    nullable: true,
  })
  content: string | null;

  @ApiProperty({
    type: String,
    description: 'The URL of the article',
    uniqueItems: true,
  })
  bannerImage: string | null;

  @ApiProperty({
    type: String,
    description: 'The URL of the article',
    uniqueItems: true,
  })
  thumbnailUrl: string | null;

  @ApiProperty({
    type: String,
    description: 'The URL of the article',
    uniqueItems: true,
  })
  focusNewsCategoryId: string;

  @ApiProperty({
    type: FocusNewsCategory,
    description: 'The URL of the article',
    uniqueItems: true,
  })
  focusNewsCategory: FocusNewsCategory;
}
