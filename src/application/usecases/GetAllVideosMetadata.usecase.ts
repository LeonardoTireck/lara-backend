import { VideoComment } from "../../domain/VideoComment";
import { VideoMetadataRepository } from "../ports/VideoMetadataRepository";

export class GetAllVideosMetadata {
  constructor(private videoMetaDataRepo: VideoMetadataRepository) {}

  async execute(): Promise<Output> {
    const videos = await this.videoMetaDataRepo.findAll();
    if (!videos || videos.length === 0) throw new Error("Video not found.");

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
