import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { GcCmsUserEntity } from '@src/users/infrastructure/persistence/relational/entities/gc-cms.user.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.gcCmsOtp,
})
export class GcCmsOtpEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string | null;

  @Column({ type: 'varchar', nullable: true })
  @Index('idx_otp_verification_email')
  email: string | null;

  @Column({ type: 'varchar', length: 10 })
  otp: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  is_used: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'now()' })
  updated_at: Date;

  @ManyToOne(() => GcCmsUserEntity, (user) => user.otp, { nullable: true })
  @JoinColumn({ name: 'gc_cms_user_id' })
  user: GcCmsUserEntity;
}
