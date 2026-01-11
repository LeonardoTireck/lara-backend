import { inject, injectable } from 'inversify';
import { VideoMetadataRepository } from '../ports/videoMetadataRepository';
import { TYPES } from '../../di/types';
import { VideoComment } from '../../domain/entities/videoComment';

@injectable()
export class GetAllVideosMetadata {
  constructor(
    @inject(TYPES.VideoMetadataRepository)
    private readonly videoMetaDataRepo: VideoMetadataRepository,
  ) {}

  async execute(): Promise<Output> {
    const videos = await this.videoMetaDataRepo.findAll();
    if (!videos || videos.length === 0) return [];

    return videos.map((v) => ({
      id: v.id,
      name: v.name,
      uploadDate: v.uploadDate,
      thumbnailUrl: v.thumbnailUrl,
      category: v.category,
      description: v.description,
      comments: v.videoComments,
    }));
  }
}

type Output = {
  id: string;
  name: string;
  uploadDate: Date;
  thumbnailUrl: string;
  category: string;
  description: string;
  comments: VideoComment[];
}[];
