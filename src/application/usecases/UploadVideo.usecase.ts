import { Video } from '../../domain/Video';
import { VideoStorageService } from '../ports/VideoStorageService';
import { VideoMetadataRepository } from '../ports/VideoMetadataRepository';
import { StorageKeyBuilder } from '../../domain/StorageKeyBuilder';

export class UploadVideo {
    constructor(
        private metadataRepo: VideoMetadataRepository,
        private storageService: VideoStorageService,
    ) {}

    async execute(input: Input): Promise<Output> {
        const video = Video.create(
            input.name,
            '',
            input.category,
            input.description,
        );

        const thumbnailKey = StorageKeyBuilder.build(
            'thumbnail',
            input.name,
            video.id,
        );

        const thumbnailUrl = await this.storageService.upload(
            input.thumbnailBuffer,
            thumbnailKey,
        );

        const videoKey = StorageKeyBuilder.build('video', input.name, video.id);

        const videoUrl = await this.storageService.upload(
            input.videoBuffer,
            videoKey,
        );

        video.updateThumbnailUrl(thumbnailUrl);

        await this.metadataRepo.save(video);

        return {
            id: video.id,
            name: video.name,
            uploadDate: video.uploadDate,
            thumbnailUrl: video.thumbnailUrl,
            videoUrl: videoUrl,
            category: video.category,
            description: video.description,
        };
    }
}

interface Input {
    name: string;
    category: string;
    description: string;
    videoBuffer: Buffer;
    thumbnailBuffer: Buffer;
}

interface Output {
    id: string;
    name: string;
    uploadDate: Date;
    thumbnailUrl: string;
    videoUrl: string;
    category: string;
    description: string;
}
