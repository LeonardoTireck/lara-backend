import { Video } from "../../domain/Video";
import { VideoStorageService } from "../ports/VideoStorageService";
import { VideoMetadataRepository } from "../ports/VideoMetadataRepository";

export class UploadVideo {
  constructor(
    private metadataRepo: VideoMetadataRepository,
    private storageService: VideoStorageService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const videoUrl = await this.storageService.upload(
      input.fileBuffer,
      input.fileName,
    );
    const video = Video.create(
      input.name,
      videoUrl,
      input.category,
      input.description,
    );
    await this.metadataRepo.save(video);

    return {
      id: video.id,
      name: video.name,
      uploadDate: video.uploadDate,
      videoUrl: video.videoUrl,
      category: video.category,
      description: video.description,
    };
  }
}

type Input = {
  name: string;
  category: string;
  description: string;
  fileBuffer: Buffer;
  fileName: string;
};

type Output = {
  id: string;
  name: string;
  uploadDate: Date;
  videoUrl: string;
  category: string;
  description: string;
};
