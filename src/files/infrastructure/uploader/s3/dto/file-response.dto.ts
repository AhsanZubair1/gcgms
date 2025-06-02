import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FileResponseDto {
  @ApiProperty({
    type: String,
  })
  @IsOptional()
  uploadSignedUrl?: string;

  @ApiProperty({
    type: String,
  })
  key: string;
}
