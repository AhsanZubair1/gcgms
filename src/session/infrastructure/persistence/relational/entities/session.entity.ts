import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Column,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { GcCmsUserEntity } from '@src/users/infrastructure/persistence/relational/entities/gc-cms.user.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.gcCmsSession,
})
export class GcCmsSessionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GcCmsUserEntity, {
    eager: true,
  })
  @Index()
  @JoinColumn({ name: 'gc_cms_user_id' })
  gc_cms_user: GcCmsUserEntity;

  @Column()
  hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
