import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { MultiLingual } from '@src/common/types/multi-lingual';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.notifications,
})
export class NotificationEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar', nullable: true })
  user_id: string | null;

  @ManyToOne(() => UserEntity, { eager: true })
  @Index()
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', nullable: true, name: 'type' })
  type: string | null;

  @Column({ type: 'jsonb', name: 'title' })
  title: MultiLingual;

  @Column({ type: 'jsonb', name: 'message' })
  message: MultiLingual;

  @Column({ type: 'boolean', name: 'is_read', default: false })
  is_read: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'metadata' })
  metadata: Record<string, string | number | boolean | null> | null;

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
