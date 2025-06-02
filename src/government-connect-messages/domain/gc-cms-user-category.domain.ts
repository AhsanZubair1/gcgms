import { ApiProperty } from '@nestjs/swagger';

import { MultiLingual, MultiLingualDto } from '@src/common/types/multi-lingual';

export class GcCmsUserCategory {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'The unique identifier of the category',
  })
  id: string;

  @ApiProperty({
    type: () => MultiLingualDto,
    description: 'The display value of the category',
  })
  value: MultiLingual;

  @ApiProperty({
    type: () => MultiLingualDto,
    nullable: true,
    description: 'Optional description of the category',
  })
  description?: MultiLingual | null;

  @ApiProperty({
    type: Boolean,
    default: true,
    description: 'Whether the category is active',
  })
  isActive: boolean;

  @ApiProperty({
    type: Number,
    default: 0,
    description: 'Sort order for category display',
  })
  sortOrder: number;
}
