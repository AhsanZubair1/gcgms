import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
const idType = Number;

export class UserSummary {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;
}
