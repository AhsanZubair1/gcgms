import { Video } from '@src/government-connect-messages/domain/video.domain';
import { VideoEntity } from '@src/government-connect-messages/infrastructure/persistence/relational/entities/video.entity';

export class VideoMapper {
  static toDomain(raw: VideoEntity): Video {
    const domainEntity = new Video();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.tags = raw.tags;
    domainEntity.speakerName = raw.speaker_name;
    domainEntity.summary = raw.summary;
    domainEntity.videoUrl = raw.video_url;
    domainEntity.content = raw.content;
    domainEntity.thumbnailUrl = raw.thumbnail_url;
    domainEntity.duration = raw.duration;
    domainEntity.createdBy = raw.created_by;
    domainEntity.updatedBy = raw.updated_by;
    domainEntity.createdAt = raw.created_at.toISOString();
    domainEntity.updatedAt = raw.updated_at.toISOString();

    return domainEntity;
  }
}
