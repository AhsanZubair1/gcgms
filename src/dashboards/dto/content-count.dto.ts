import { ApiProperty } from '@nestjs/swagger';

export class ContentCountResponseDto {
  @ApiProperty({
    description: 'The label for the time period (e.g., date or month)',
    example: '2025-05-01',
  })
  label: string;

  @ApiProperty({
    description: 'The count of articles for the given time period',
    example: '5',
  })
  articleCount: string;

  @ApiProperty({
    description: 'The count of videos for the given time period',
    example: '3',
  })
  videoCount: string;
}
