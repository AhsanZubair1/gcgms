// article.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty({
    description: 'Unique identifier of the article',
    example: ' Changed to number to match entity',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'Brief summary of the article',
    example: 'This is a summary of the article content',
    type: String,
    nullable: true,
  })
  summary: string | null;

  @ApiProperty({
    description: 'URL of the banner image',
    example: 'https://example.com/images/banner.jpg',
    type: String,
  })
  image: string;
}
