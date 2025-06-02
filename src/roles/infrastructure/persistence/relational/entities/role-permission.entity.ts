import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';

import { PermissionsEntity } from './permission.entity';
import { RolesEntity } from './roles.entity';

@Entity({ name: TABLES.rolePermissions })
export class RolePermissionsEntity {
  @PrimaryColumn({ name: 'role_id' })
  role_id: string;

  @PrimaryColumn({ name: 'permission_id' })
  permission_id: string;

  @ManyToOne(() => RolesEntity)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;

  @ManyToOne(() => PermissionsEntity)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionsEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
