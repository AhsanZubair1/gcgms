import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { RolesEntity } from '@src/roles/infrastructure/persistence/relational/entities/roles.entity';

import { GcCmsUserEntity } from './gc-cms.user.entity';

@Entity({ name: TABLES.gcCmsUserRole })
export class GcCmsUserRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'gc_cms_user_id', type: 'uuid' })
  gc_cms_user_id: string;

  @Column({ name: 'role_id', type: 'uuid' })
  role_id: string;

  @ManyToOne(() => GcCmsUserEntity, (user) => user.gc_cms_roles)
  @JoinColumn({ name: 'gc_cms_user_id' })
  user: GcCmsUserEntity;

  @ManyToOne(() => RolesEntity)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
