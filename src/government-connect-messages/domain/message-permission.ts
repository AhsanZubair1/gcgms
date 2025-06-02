import { ApiProperty } from '@nestjs/swagger';

import { Category } from '@src/categories/domain/category';

export class MessagePermission {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'The unique identifier of the permission',
  })
  id: string;

  @ApiProperty({
    type: Category,
    description: 'The category this permission applies to',
    nullable: true,
  })
  userCategory?: Category | null;

  @ApiProperty({
    type: String,
    description: 'Comma-separated list of armed force branches',
    nullable: true,
  })
  armedForceBranch?: string | null;

  @ApiProperty({
    type: Date,
    description: 'When the permission was created',
  })
  createdAt: Date;
}
