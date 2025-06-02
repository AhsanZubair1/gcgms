import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { PlatFormEnum } from '@src/notifications/enum/platform.enum';
import { GcCmsUserEntity } from '@src/users/infrastructure/persistence/relational/entities/gc-cms.user.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.gcCmsNotificationTokens,
})
export class GcCmsNotificationTokenEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar', nullable: true })
  gc_cms_user_id: string | null;

  @ManyToOne(() => GcCmsUserEntity, { eager: true })
  @JoinColumn({ name: 'gc_cms_user_id' })
  gc_cms_user: GcCmsUserEntity;

  @Column({ type: 'varchar' })
  device_id: string;

  @Column({ type: 'text' })
  device_token: string;

  @Column({ type: 'enum', enum: PlatFormEnum })
  platform: PlatFormEnum;

  @Column({ type: 'varchar', length: 50 })
  device_type: string;

  @Column({ type: 'varchar', length: 20 })
  app_version: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_active_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
