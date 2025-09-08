import { inject, injectable } from 'inversify';
import { VideoComment } from '../../domain/VideoComment';
import { VideoMetadataRepository } from '../ports/VideoMetadataRepository';
import { TYPES } from '../../di/Types';

@injectable()
export class AddCommentToVideo {
    constructor(
        @inject(TYPES.VideoMetadataRepository)
        private readonly videoRepo: VideoMetadataRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
        const video = await this.videoRepo.findById(input.videoId);
        if (!video) throw new Error('Video not found.');

        const newComment = VideoComment.create(input.author, input.text);
        video.addComment(newComment);

        await this.videoRepo.save(video);

        return {
            videoId: video.id,
            commentId: newComment.id,
            author: newComment.author,
            text: newComment.text,
        };
    }
}

interface Input {
    videoId: string;
    author: string;
    text: string;
}

interface Output {
    videoId: string;
    commentId: string;
    author: string;
    text: string;
}
