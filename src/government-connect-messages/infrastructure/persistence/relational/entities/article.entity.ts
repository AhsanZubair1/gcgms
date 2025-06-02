import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { FocusNewsCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/focus-news-categories.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity(TABLES.article)
export class ArticleEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  url: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'varchar', length: 255, nullable: false })
  author: string;

  @Column({ type: 'timestamp', nullable: true })
  publication_date: Date | null;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by: string | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: false })
  thumbnail_url: string | null;

  @Column({ type: 'text', nullable: false })
  banner_image: string | null;

  @Column({ type: 'uuid', nullable: false })
  focus_news_category_id: string;

  @ManyToOne(() => FocusNewsCategoryEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'focus_news_category_id' })
  category?: FocusNewsCategoryEntity;
}
