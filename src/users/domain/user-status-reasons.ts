import { ApiProperty } from '@nestjs/swagger';

import { MultiLingual, MultiLingualDto } from '@src/common/types/multi-lingual';

export class UserStatusReasons {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'The unique identifier of the armed force branch',
  })
  id: string;

  @ApiProperty({
    type: () => MultiLingualDto,
    description: 'The name/value of the armed force branch',
  })
  value: MultiLingual;

  @ApiProperty({
    type: () => MultiLingualDto,
    description: 'Detailed description about the armed force branch',
  })
  description?: MultiLingual;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the armed force branch is active',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: Number,
    description: 'Sorting order for display purposes',
    default: 0,
  })
  sortOrder: number;
}
