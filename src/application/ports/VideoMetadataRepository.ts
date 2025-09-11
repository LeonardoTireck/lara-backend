import { Video } from '../../domain/Aggregates/Video';

export interface VideoMetadataRepository {
    findAll(): Promise<Video[] | undefined>;
    findById(videoId: string): Promise<Video | undefined>;
    save(video: Video): Promise<void>;
    update(video: Video): Promise<void>;
    delete(videoId: string): Promise<void>;
}
