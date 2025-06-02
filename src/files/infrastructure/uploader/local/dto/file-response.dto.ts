import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({
    type: String,
    example: 'file-uuid',
    description: 'The ID of the file',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/path/to/file.jpg',
    description: 'The path to the file',
  })
  path: string;

  @ApiProperty({
    type: String,
    example: 'selfie',
    description: 'The type of the file (e.g., selfie, id_card)',
  })
  type: string; // Add type

  @ApiProperty({
    type: String,
    example: 'user-uuid',
    description: 'The ID of the user associated with the file',
  })
  userId: string; // Add userId
}
