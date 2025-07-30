import { VideoMetadataRepository } from "../../application/ports/VideoMetadataRepository";
import { Video } from "../../domain/Video";

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
    if (!videoToBeUpdated) throw new Error("Video not found.");
    if (video.category) {
      videoToBeUpdated.updateCategory(video.category);
    }
    if (video.description) {
      videoToBeUpdated.updateDescription(video.description);
    }
    if (video.thumbnailUrl) {
      videoToBeUpdated.updateThumbailUrl(video.thumbnailUrl);
    }
  }
}
