import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Permission {
  @ApiProperty({
    type: String,
    description: 'Permission UUID',
    example: 'e4eaaaf2-d142-11e1-b3e4-080027620cdd',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    description: 'The module the permission is associated with',
    example: 'Dashboard',
  })
  @Expose()
  module: string;

  @ApiProperty({
    type: String,
    description: 'The action associated with the permission',
    example: 'CREATE',
  })
  @Expose()
  action: string;

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
