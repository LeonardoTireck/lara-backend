import { AddCommentToVideo } from '../../../src/application/usecases/AddCommentToVideo.usecase';
import { UploadVideo } from '../../../src/application/usecases/UploadVideo.usecase';
import { InMemoryVideoRepository } from '../../../src/infrastructure/videoRepo/inMemory';
import { InMemoryVideoStorage } from '../../../src/infrastructure/videoStorage/inMemory';

describe('AddCommentToVideo Use Case', () => {
    let videoRepo: InMemoryVideoRepository;
    let useCaseAddCommentToVideo: AddCommentToVideo;
    let videoId: string;

    beforeEach(async () => {
        videoRepo = new InMemoryVideoRepository();
        const storageService = new InMemoryVideoStorage();
        const useCaseUploadVideo = new UploadVideo(videoRepo, storageService);
        useCaseAddCommentToVideo = new AddCommentToVideo(videoRepo);

        const input = {
            name: 'First Video',
            category: 'Stretching',
            description: 'Video description',
            videoBuffer: Buffer.from('fake-content'),
            thumbnailBuffer: Buffer.from('fake-thumb'),
        };
        const outputUploadVideo = await useCaseUploadVideo.execute(input);
        videoId = outputUploadVideo.id;
    });

    it('should add a comment to a video', async () => {
        const inputForAddComment = {
            videoId: videoId,
            author: 'Fake User',
            text: 'Fake comment',
        };

        const outputAddComment =
            await useCaseAddCommentToVideo.execute(inputForAddComment);

        expect(outputAddComment.commentId).toBeDefined();
        expect(outputAddComment.videoId).toBe(videoId);
        expect(outputAddComment.author).toBe(inputForAddComment.author);
        expect(outputAddComment.text).toBe(inputForAddComment.text);

        const video = await videoRepo.findById(videoId);
        expect(video?.videoComments.length).toBe(1);
        expect(video?.videoComments[0].author).toBe(inputForAddComment.author);
    });

    it('should throw an error if the video is not found', async () => {
        const inputForAddComment = {
            videoId: 'non-existent-video-id',
            author: 'Fake User',
            text: 'Fake comment',
        };

        await expect(
            useCaseAddCommentToVideo.execute(inputForAddComment),
        ).rejects.toThrow('Video not found.');
    });
});
