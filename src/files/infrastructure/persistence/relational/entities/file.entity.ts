import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EppEntity } from '@src/common/api-entities/infrastructure/persistence/entities/epp.entity';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

@Entity({ name: 'file' })
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar', name: 'user_id', nullable: true })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.photos, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', name: 'epp_id', nullable: true })
  epp_id: string;

  @ManyToOne(() => EppEntity, (epp) => epp.photos, { nullable: true })
  @JoinColumn({ name: 'epp_id' })
  epp: EppEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
