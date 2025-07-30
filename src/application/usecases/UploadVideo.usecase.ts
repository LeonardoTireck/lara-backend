import { Video } from "../../domain/Video";
import { VideoStorageService } from "../ports/VideoStorageService";
import { VideoMetadataRepository } from "../ports/VideoMetadataRepository";
import { StorageKeyBuilder } from "../../domain/StorageKeyBuilder";
import crypto from "crypto";

export class UploadVideo {
  constructor(
    private metadataRepo: VideoMetadataRepository,
    private storageService: VideoStorageService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const id = crypto.randomUUID();

    const thumbnailUrl = await this.storageService.upload(
      input.thumbnailBuffer,
      StorageKeyBuilder.build("thumbnail", input.name, id),
    );

    const videoUrl = await this.storageService.upload(
      input.videoBuffer,
      StorageKeyBuilder.build("video", input.name, id),
    );

    const video = Video.create(
      id,
      input.name,
      thumbnailUrl,
      input.category,
      input.description,
    );
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

type Input = {
  name: string;
  category: string;
  description: string;
  videoBuffer: Buffer;
  thumbnailBuffer: Buffer;
};

type Output = {
  id: string;
  name: string;
  uploadDate: Date;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  description: string;
};
