import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { ArmedForceBranch } from '@src/armed-force-branches/domain/armed-force-branch';
import { Category } from '@src/categories/domain/category';
import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';
import { Notification } from '@src/notifications/domain/notification';
import { GenderEnum } from '@src/utils/enums/gender.enum';
import { UserVerificationStatus } from '@src/utils/enums/user-verification.enum';

import { UserStatusReasons } from './user-status-reasons';

export class User {
  @ApiProperty({
    type: String,
    description: 'UUID Auto Increment',
    example: 1,
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    description: 'Encrypted military ID',
    example: 'ABC123456',
  })
  @Exclude({ toPlainOnly: true })
  militaryId: string;

  @ApiProperty({
    type: String,
    description: 'MyKad ID',
    example: '123456789012',
  })
  mykadId: string;

  @ApiProperty({
    type: String,
    example: '+93110357070',
    description: 'Primary phone number',
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    example: 'email',
    description: 'Preferred communication method (whats app , sms, etc.)',
  })
  @Expose()
  preferredCommunicationMethod: string;

  @ApiProperty({
    type: String,
    example: '+93110357070',
    description: 'Secondary phone number',
  })
  @Expose()
  secondaryPhone: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
    nullable: true,
  })
  @Expose()
  email: string | null;

  @ApiProperty({
    type: String,
    description: 'URL or path to profile image',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Expose()
  profileImage: string | null;

  @ApiProperty({
    type: String,
    description: 'URL or path to profile image',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Expose()
  selfie: string | null;

  @ApiProperty({
    type: String,
    description: 'URL or path to profile image',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Expose()
  militaryIdImage: string | null;

  @ApiProperty({
    type: String,
    description: 'URL or path to profile image',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Expose()
  profileImageKey: string | null;

  @ApiProperty({
    type: String,
    description: 'URL or path to profile image',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Expose()
  selfieKey: string | null;

  @ApiProperty({
    type: String,
    description: 'URL or path to profile image',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Expose()
  militaryIdImageKey: string | null;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  @Expose()
  fullName: string;

  @ApiProperty({
    type: String,
    example: 'Male',
    enum: GenderEnum,
  })
  @Expose()
  gender: GenderEnum;

  @ApiProperty({
    type: Category,
    description: 'User category',
    example: 'military',
  })
  @Expose()
  category: Category;

  @ApiProperty({
    description: 'Armed force branch information',
    nullable: true,
  })
  armedForceBranch: ArmedForceBranch | null;

  @ApiProperty({
    type: Boolean,
    example: false,
    default: false,
  })
  @Expose()
  biometricLogin: boolean;

  @ApiProperty({
    type: String,
    description: 'Encrypted password',
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({
    type: String,
    description: 'Referral code',
    example: 'REF123',
    nullable: true,
  })
  @Expose()
  referralCode: string | null;

  @ApiProperty({
    type: String,
    description: 'Referral code',
    example: 'REF123',
    nullable: true,
  })
  @Expose()
  organization: string | null;

  @ApiProperty({
    type: User,
    nullable: true,
  })
  @Expose()
  reasons: UserStatusReasons[] | null;

  @ApiProperty({
    enum: UserVerificationStatus,
    example: UserVerificationStatus.PENDING,
    description: 'User verification status',
  })
  @Expose()
  verificationStatus: string;

  @ApiProperty({
    type: String,
    description: 'Verification token',
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  verificationToken: string | null;

  @ApiProperty({
    type: Date,
    description: 'Date of birth',
    example: '1990-01-01',
    nullable: true,
  })
  @Expose()
  dateOfBirth: Date | null;

  @ApiProperty({
    type: Date,
    nullable: true,
    example: null,
    description: 'Deletion timestamp',
  })
  @Expose()
  deletedAt: Date | null;

  @ApiProperty({
    type: Date,
    nullable: true,
    example: null,
    description: 'Deletion timestamp',
  })
  @Expose()
  createdAt: string | null;

  @ApiProperty({
    type: () => [FileEntity],
    description: 'User photos',
    nullable: true,
  })
  @Expose()
  photos?: FileEntity[] | null;

  @ApiProperty({
    type: () => [Notification],
    description: 'List of notifications for this user',
  })
  @Expose()
  notifications: Notification[] | null;
}
