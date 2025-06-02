import { ApiProperty } from '@nestjs/swagger';

// Interface for multilingual content that can be used in entities and domain models
export interface MultiLingual {
  en: string;
  ms: string;
}

// Class implementation for DTOs with Swagger decorations
export class MultiLingualDto implements MultiLingual {
  @ApiProperty({
    description: 'English translation',
    example: 'English text',
  })
  en: string;

  @ApiProperty({
    description: 'Malaysian translation',
    example: 'Teks Bahasa Malaysia',
  })
  ms: string;
}
