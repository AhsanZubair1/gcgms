import { ApiProperty } from '@nestjs/swagger';

export class ReasonResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: {
    en: string;
    ms: string;
  };

  @ApiProperty()
  sortOrder: number;
}
