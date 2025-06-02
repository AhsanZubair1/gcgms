import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { Permission } from './permission';

export class Roles {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    maxLength: 50,
  })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: Number,
    default: 0,
  })
  sortOrder: number;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => [Permission],
    description: 'Permissions assigned to this role',
  })
  @Expose()
  permissions: Permission[];
}
