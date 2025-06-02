import { ApiProperty } from '@nestjs/swagger';

export class VerificationStatusPercentageDto {
  @ApiProperty({
    description: 'The percentage of approved users',
    example: 75,
  })
  approvedPercentage: number;

  @ApiProperty({
    description: 'The percentage of users requiring resubmission',
    example: 15,
  })
  resubmissionPercentage: number;

  @ApiProperty({
    description: 'The percentage of pending users',
    example: 10,
  })
  pendingPercentage: number;
}
