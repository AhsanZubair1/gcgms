import { ApiProperty } from '@nestjs/swagger';

export class GetReasonsDto {
  @ApiProperty()
  categoryId: string;
}
