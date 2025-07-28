import { Comment } from "../../domain/Comment";
import { VideoMetadataRepository } from "../ports/VideoMetadataRepository";

export class GetVideo {
  constructor(private videoMetaDataRepo: VideoMetadataRepository) {}

  async execute(input: Input): Promise<Output> {
    const video = await this.videoMetaDataRepo.findById(input.videoId);
    if (!video) throw new Error("Video not found.");

    return {
      id: video.id,
      name: video.name,
      uploadDate: video.uploadDate,
      videoUrl: video.videoUrl,
      category: video.category,
      description: video.description,
      comments: video.comments,
    };
  }
}

type Input = {
  videoId: string;
};

type Output = {
  id: string;
  name: string;
  uploadDate: Date;
  videoUrl: string;
  category: string;
  description: string;
  comments: Comment[];
};
