import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { EppStatus } from '@src/utils/enums/epp-status.enum';

import { OrderEntity } from './order.entity';

@Entity({ name: TABLES.eppRequest })
export class EppEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'order_id', nullable: true, type: 'int' })
  order_id: string | null;

  @Column({ name: 'monthly_income', type: 'decimal', precision: 10, scale: 2 })
  monthly_income: number;

  @Column({ name: 'allowance', type: 'decimal', precision: 10, scale: 2 })
  allowance: number;

  @Column({ name: 'installment_tenure' })
  installment_tenure: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EppStatus,
    default: EppStatus.PENDING,
  })
  status: EppStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @OneToMany(() => FileEntity, (photo) => photo.epp, {
    eager: true,
    nullable: true,
  })
  photos?: FileEntity[] | null;
}
