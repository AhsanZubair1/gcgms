import { ApiProperty } from '@nestjs/swagger';

import { MultiLingual } from '@src/common/types/multi-lingual';

export class UserResponseDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  verificationStatus: string;

  @ApiProperty()
  category?: MultiLingual;

  @ApiProperty()
  mykadId: string;

  @ApiProperty()
  parentName?: string;

  @ApiProperty()
  createdAt: any;
}
