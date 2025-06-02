import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

import { OrderEntity } from './order.entity';

@Entity({
  name: TABLES.orderItem,
})
export class OrderItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({
    type: 'uuid',
    name: 'product_id',
  })
  product_id: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    name: 'price_at_purchase',
    nullable: false,
  })
  price_at_purchase: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  discount: number;

  @Column({
    type: 'uuid',
  })
  order_id: string;
}
