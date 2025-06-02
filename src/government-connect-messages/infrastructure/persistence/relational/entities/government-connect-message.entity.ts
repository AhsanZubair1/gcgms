import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { MessageCategoryEnum } from '@src/government-connect-messages/enum/message-type.enum';
import { ArticleEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/article.entity';
import { GcCmsUserCategoryEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/gc-cms-user-category.entity';
import { MessagePermissionEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/message-permission.entity';
import { VideoEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/video.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.governmentConnectMessage,
})
export class GovernmentConnectMessageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('increment')
  message_id: number;

  @Column({
    type: 'varchar',
    enum: ['draft', 'pending_approval', 'approved', 'published', 'archived'],
    default: 'draft',
    nullable: false,
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => VideoEntity, { nullable: true })
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity | null;

  @OneToOne(() => ArticleEntity, { nullable: true })
  @JoinColumn({ name: 'article_id' })
  article: ArticleEntity | null;

  @Column({ type: 'uuid', nullable: true })
  created_by: string | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string | null;

  @OneToOne(() => GcCmsUserCategoryEntity, { nullable: true })
  @JoinColumn({ name: 'cms_user_category_id' })
  cmsUserCategory?: GcCmsUserCategoryEntity | null;

  @Column({
    name: 'type',
    type: 'enum',
    enum: MessageCategoryEnum,
    default: MessageCategoryEnum.MINISTER,
  })
  type: MessageCategoryEnum;

  @OneToMany(
    () => MessagePermissionEntity,
    (permission) => permission.message,
    {
      cascade: true,
      nullable: true,
    },
  )
  messagePermissions: MessagePermissionEntity[] | null;
}
