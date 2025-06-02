import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { StoreHolidayEntity } from '@src/common/api-entities/infrastructure/persistence/entities/store-holiday.entity';
import { TABLES } from '@src/common/constants';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

export enum StoreStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
}

@Entity({
  name: TABLES.store,
})
export class StoreEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  code: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  state_id?: string;

  @Column({ type: 'uuid', nullable: true })
  manager_id?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  operating_hours?: string;

  @Column({
    type: 'enum',
    enum: StoreStatus,
    default: StoreStatus.OPEN,
  })
  status: StoreStatus;

  @OneToMany(() => StoreHolidayEntity, (holiday) => holiday.store)
  holidays: StoreHolidayEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
