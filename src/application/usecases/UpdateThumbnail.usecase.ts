import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/Types';
import { VideoMetadataRepository } from '../ports/VideoMetadataRepository';
import { VideoStorageService } from '../ports/VideoStorageService';
import { StorageKeyBuilder } from '../../domain/Services/StorageKeyBuilder';

@injectable()
export class UpdateThumbnail {
  constructor(
    @inject(TYPES.VideoStorage)
    private videoStorage: VideoStorageService,
    @inject(TYPES.VideoMetadataRepository)
    private videoRepo: VideoMetadataRepository,
  ) {}
  async execute(videoId: string, newThumbnail: Buffer) {
    const video = await this.videoRepo.findById(videoId);
    if (!video) throw new Error('Video not found.');

    const key = StorageKeyBuilder.build('thumbnail', video.name, video.id);

    await this.videoStorage.delete(key);

    await this.videoStorage.upload(newThumbnail, key);

    return {
      id: video.id,
      thumbnailUrl: video.thumbnailUrl,
    };
  }
}
