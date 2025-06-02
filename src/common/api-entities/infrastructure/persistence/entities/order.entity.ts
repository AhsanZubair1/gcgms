import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { OrderItemEntity } from '@src/common/api-entities/infrastructure/persistence/entities/order-item.entity';
import { StoreEntity } from '@src/common/api-entities/infrastructure/persistence/entities/store.entity';
import { TABLES } from '@src/common/constants';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

export enum OrderStatusEnum {
  PLACED = 'PLACED',
  PROCESSING = 'PROCESSING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COLLECTED = 'COLLECTED',
  CANCELLED = 'CANCELLED',
  EXPIRY = 'EXPIRY',
}

@Entity({
  name: TABLES.order,
})
export class OrderEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    generated: 'increment',
    unique: true,
  })
  order_id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  special_requests?: string;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({
    type: 'uuid',
  })
  user_id: string;

  @Column({
    type: 'uuid',
  })
  store_id: string;

  @ManyToOne(() => StoreEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'store_id' })
  store?: StoreEntity;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PLACED,
  })
  order_status: OrderStatusEnum;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  total_amount: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  cart_total: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total_discount: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  service_fee: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  tax: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  payment_method: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  payment_method_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  pickup_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expired_at: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by' })
  updated_by?: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    eager: true,
    nullable: true,
  })
  items: OrderItemEntity[] | null;
}
