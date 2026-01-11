import { NotFoundError } from '../../application/errors/appError';
import { VideoMetadataRepository } from '../../application/ports/videoMetadataRepository';
import { Video } from '../../domain/aggregates/video';

export class InMemoryVideoRepository implements VideoMetadataRepository {
  public videos: Video[] = [];

  async findAll(): Promise<Video[] | undefined> {
    return this.videos;
  }
  async findById(videoId: string): Promise<Video | undefined> {
    const video = this.videos.find((video) => video.id == videoId);
    return video;
  }
  async save(video: Video): Promise<void> {
    this.videos.push(video);
  }

  async update(video: Video): Promise<void> {
    const videoToBeUpdated = this.videos.find((v) => v.id == video.id);
    if (!videoToBeUpdated) throw new NotFoundError('Video');

    videoToBeUpdated.updateCategory(video.category);
    videoToBeUpdated.updateDescription(video.description);
    videoToBeUpdated.updateThumbnailUrl(video.thumbnailUrl);
  }
  async delete(videoId: string): Promise<void> {
    const videoToBeDeletedIndex = this.videos.findIndex(
      (video) => video.id == videoId,
    );
    if (videoToBeDeletedIndex === -1) throw new NotFoundError('Video');
    this.videos.splice(videoToBeDeletedIndex, 1);
  }
}
