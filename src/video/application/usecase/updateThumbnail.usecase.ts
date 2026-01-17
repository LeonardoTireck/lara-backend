import { injectable, inject } from 'inversify';
import { NotFoundError } from '../../../error/appError';
import { TYPES } from '../../../di/types';
import { VideoMetadataRepository } from '../interface/videoMetadataRepository';
import { VideoStorageService } from '../interface/videoStorageService';
import { StorageKeyBuilder } from '../../../domain/services/storageKeyBuilder';

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
    if (!video) throw new NotFoundError('Video');

    const key = StorageKeyBuilder.build('thumbnail', video.name, video.id);

    await this.videoStorage.delete(key);

    await this.videoStorage.upload(newThumbnail, key);

    return {
      id: video.id,
      thumbnailUrl: video.thumbnailUrl,
    };
  }
}
