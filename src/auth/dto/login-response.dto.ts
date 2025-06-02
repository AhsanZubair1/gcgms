import { ApiProperty } from '@nestjs/swagger';

import { GcCmsUser } from '@src/users/domain/gc-cms-user';
import { User } from '@src/users/domain/user';

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty({
    type: () => User,
  })
  user: GcCmsUser;
}
