import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ArmedForceBranchEntity } from '@src/armed-force-branches/infrastructure/persistence/relational/entities/armed-force-branch.entity';
import { CategoryEntity } from '@src/categories/infrastructure/persistence/relational/entities/category.entity';
import { OtpEntity } from '@src/common/api-entities/infrastructure/persistence/entities/otp.entity';
import { SessionEntity } from '@src/common/api-entities/infrastructure/persistence/entities/session.entity';
import { TABLES } from '@src/common/constants';
import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';
import { NotificationEntity } from '@src/notifications/infrastructure/persistence/relational/entities/notification.entity';
import { GenderEnum } from '@src/utils/enums/gender.enum';
import { UserVerificationStatus } from '@src/utils/enums/user-verification.enum';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.user,
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  @Exclude({ toPlainOnly: true })
  military_id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  @Exclude({ toPlainOnly: true })
  mykad_id: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  phone_number: string;

  @Column({ type: 'varchar', length: 20 })
  preferred_communication_method: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  profile_image: string | null;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
  })
  gender: GenderEnum;

  @ManyToOne(() => CategoryEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category?: CategoryEntity;

  @ManyToOne(() => ArmedForceBranchEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'armed_force_branch' })
  armed_force_branch: ArmedForceBranchEntity | null;

  @Column({ type: 'text' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  referral_code: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  organization: string | null;

  @Column({
    type: 'enum',
    default: UserVerificationStatus.PENDING,
    enum: UserVerificationStatus,
  })
  verification_status: string;

  @Column({ type: 'text', nullable: true })
  reasons: string | null;

  @Column({ type: 'text', nullable: true })
  additional_comments: string | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  @Exclude({ toPlainOnly: true })
  verification_token: string | null;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => FileEntity, (photo) => photo.user, {
    eager: true,
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  photos?: FileEntity[] | null;

  @OneToMany(() => SessionEntity, (session) => session.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sessions?: SessionEntity[] | null;

  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: true,
  })
  notifications: NotificationEntity[] | null;

  @OneToMany(() => OtpEntity, (otp) => otp.user, {
    cascade: true,
  })
  otp: OtpEntity[] | null;
}
