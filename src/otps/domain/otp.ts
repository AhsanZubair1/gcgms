import { ApiProperty } from '@nestjs/swagger';

export class GcCmsOtp {
  @ApiProperty({
    type: Number,
    description: 'Auto-incremented ID of the OTP record',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Phone number associated with the OTP',
    maxLength: 20,
  })
  phoneNumber: string | null;

  @ApiProperty({
    type: String,
    description: 'email',
  })
  email: string | null;

  @ApiProperty({
    type: String,
    description: 'One-time password code',
    maxLength: 10,
  })
  otp: string;

  @ApiProperty({
    type: Date,
    description: 'Expiration timestamp of the OTP',
  })
  expiresAt: Date;

  @ApiProperty({
    type: Boolean,
    description: 'Flag indicating if the OTP has been used',
    default: false,
  })
  isUsed: boolean;

  @ApiProperty({
    type: Date,
    description: 'Creation timestamp of the OTP record',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Last update timestamp of the OTP record',
  })
  updatedAt: Date;
}
