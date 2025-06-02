import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { GcCmsCategory } from '@src/categories/domain/gc-cms-category';
import { Roles } from '@src/roles/domain/roles';

export class GcCmsUser {
  @ApiProperty({
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '+1234567890',
  })
  phoneNumber?: string;

  @ApiProperty({
    type: String,
    example: 'hashed_password_string',
  })
  @Exclude()
  password: string;

  @ApiProperty({
    type: Date,
    required: false,
    example: '2023-01-01T00:00:00.000Z',
  })
  @Exclude()
  lastLogin?: Date;

  @ApiProperty({
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Pending'],
    default: 'Active',
    example: 'Active',
  })
  status: string;

  @ApiProperty({
    type: () => String,
    required: false,
  })
  profilePicture?: string | null;

  @ApiProperty({
    type: () => String,
    required: false,
  })
  profilePictureKey?: string | null;

  @ApiProperty({
    type: GcCmsCategory,
    description: 'User category',
    example: 'military',
  })
  @Expose()
  gcCmsCategory: GcCmsCategory;

  @ApiProperty({
    type: Roles,
    description: 'User category',
    example: 'military',
  })
  @Expose()
  gcCmsRoles: Roles[];

  @ApiProperty({
    type: String,
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Exclude()
  profilePictureId: string;

  @ApiProperty({
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
  })
  @Exclude()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
  })
  @Exclude()
  updatedAt: Date;
}
