import { VideoMetadataRepository } from "../ports/VideoMetadataRepository";

export class AddCommentToVideo {
  constructor(private videoRepo: VideoMetadataRepository) {}

  async execute(input: Input): Promise<Output> {
    return {};
  }
}

type Input = {
  videoId: string;
  author: string;
  text: string;
};

type Output = {
  videoId: string;
  author: string;
  text: string;
};
