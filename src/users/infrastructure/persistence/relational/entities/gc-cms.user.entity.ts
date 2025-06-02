import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { GcCmsCategoryEntity } from '@src/categories/infrastructure/persistence/relational/entities/gc-cms-category.entity';
import { TABLES } from '@src/common/constants';
import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';
import { GcCmsOtpEntity } from '@src/otps/infrastructure/persistence/relational/entities/otp.entity';
import { GcCmsSessionEntity } from '@src/session/infrastructure/persistence/relational/entities/session.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

import { GcCmsUserRoleEntity } from './gc-cms-user-role.entity';

@Entity({ name: TABLES.gcCmsUser })
export class GcCmsUserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  first_name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  last_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phone_number?: string;

  @Column({
    name: 'last_login',
    type: 'timestamp without time zone',
    nullable: true,
  })
  last_login?: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'Active',
  })
  status: string;

  @Column({
    type: 'varchar',
    name: 'profile_picture_id',
    nullable: true,
  })
  profile_picture_id: string;

  @OneToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'profile_picture_id' })
  profile_picture?: FileEntity | null;

  @Column({ name: 'gc_cms_category_id', type: 'uuid', nullable: true })
  gc_cms_category_id?: string;

  @ManyToOne(() => GcCmsCategoryEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'gc_cms_category_id' })
  gc_cms_category?: GcCmsCategoryEntity;

  @OneToMany(() => GcCmsUserRoleEntity, (userRole) => userRole.user)
  gc_cms_roles?: GcCmsUserRoleEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
  updatedAt: Date;

  @OneToMany(() => GcCmsOtpEntity, (otp) => otp.user, {
    cascade: true,
  })
  otp: GcCmsOtpEntity[] | null;

  @OneToMany(() => GcCmsSessionEntity, (session) => session.gc_cms_user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sessions?: GcCmsSessionEntity[] | null;
}
