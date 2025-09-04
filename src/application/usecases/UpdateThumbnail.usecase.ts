import { StorageKeyBuilder } from '../../domain/StorageKeyBuilder';
import { VideoMetadataRepository } from '../ports/VideoMetadataRepository';
import { VideoStorageService } from '../ports/VideoStorageService';

export class UpdateThumbnail {
    constructor(
        private videoStorage: VideoStorageService,
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
