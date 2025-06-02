import { ApiProperty } from '@nestjs/swagger';

export class Video {
  @ApiProperty({
    type: Number,
    description: 'The unique identifier of the video',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The title of the video',
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    type: [String],
    description: 'Tags associated with the video',
    nullable: true,
  })
  tags: string[] | null;

  @ApiProperty({
    type: String,
    description: 'Name of the speaker in the video',
    maxLength: 255,
    nullable: true,
  })
  speakerName: string | null;

  @ApiProperty({
    type: Date,
    description: 'The publication date of the video',
    nullable: true,
  })
  publicationDate: Date | null;

  @ApiProperty({
    type: String,
    description: 'A summary of the video content',
    nullable: true,
  })
  summary: string | null;

  @ApiProperty({
    type: String,
    description: 'URL to the video file',
    required: true,
  })
  videoUrl: string;

  @ApiProperty({
    type: String,
    description: 'Transcript or description of video content',
    nullable: true,
  })
  content: string | null;

  @ApiProperty({
    type: String,
    description: 'URL to the video thumbnail image',
    nullable: true,
  })
  thumbnailUrl: string | null;

  @ApiProperty({
    type: String,
    description: 'Duration of the video in ISO 8601 duration format',
    example: 'PT1H30M',
    nullable: true,
  })
  duration: string | null;

  @ApiProperty({
    type: Date,
    description: 'The date when the video was created',
  })
  createdAt: string;

  @ApiProperty({
    type: Date,
    description: 'The date when the video was last updated',
  })
  updatedAt: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID of the user who created the video',
    nullable: true,
  })
  createdBy: string | null;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'ID of the user who last updated the video',
    nullable: true,
  })
  updatedBy: string | null;
}
