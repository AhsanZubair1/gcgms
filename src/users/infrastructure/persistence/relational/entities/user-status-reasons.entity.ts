import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CategoryEntity } from '@src/categories/infrastructure/persistence/relational/entities/category.entity';
import { TABLES } from '@src/common/constants';
import { MultiLingual } from '@src/common/types/multi-lingual';
import { UserStatusReasonsEnum } from '@src/users/enum/user-status.enum';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.userStatusReasons,
})
export class UserStatusReasonsEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: false })
  value: MultiLingual;

  @Column({ type: 'jsonb', nullable: true })
  description?: MultiLingual;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: UserStatusReasonsEnum,
    default: UserStatusReasonsEnum.RESUBMISSION,
  })
  type: UserStatusReasonsEnum;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @ManyToOne(() => CategoryEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'user_category' })
  category?: CategoryEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
