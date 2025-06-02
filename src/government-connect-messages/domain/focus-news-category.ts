import { ApiProperty } from '@nestjs/swagger';

import { MultiLingual, MultiLingualDto } from '@src/common/types/multi-lingual';

export class FocusNewsCategory {
  @ApiProperty({
    type: String,
    description: 'Auto-incremented ID of the category',
    example: 1,
  })
  id: string;

  @ApiProperty({
    type: () => MultiLingualDto,
    description: 'The value/name of the category',
    required: true,
  })
  value: MultiLingual;

  @ApiProperty({
    type: () => MultiLingualDto,
    description: 'Detailed description of the category',
    required: false,
  })
  description?: MultiLingual;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the category is active',
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: Number,
    description: 'Sorting order of the category',
    example: 2,
    default: 0,
  })
  sortOrder: number;
}
