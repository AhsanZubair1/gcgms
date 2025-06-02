import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CategoryEntity } from '@src/categories/infrastructure/persistence/relational/entities/category.entity';
import { TABLES } from '@src/common/constants';
import { GovernmentConnectMessageEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/government-connect-message.entity';

@Entity(TABLES.messagePermissions)
export class MessagePermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GovernmentConnectMessageEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: GovernmentConnectMessageEntity;

  @OneToOne(() => CategoryEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'user_category' })
  userCategory?: CategoryEntity | null;

  @Column({ name: 'armed_force_branch', type: 'varchar', nullable: true })
  armed_force_branch?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
