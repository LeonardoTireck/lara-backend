import { Video } from '../../../src/domain/Aggregates/Video';
import { VideoComment } from '../../../src/domain/Entities/VideoComment';

describe('Video Entity', () => {
    let video: Video;

    beforeEach(() => {
        video = Video.create(
            'First Video',
            'www.fake-thumb.com',
            'Stretching',
            'Video description',
        );
    });

    describe('Video Creation', () => {
        it('should create a new video', () => {
            expect(video).toBeDefined();
            expect(video.id).toBeDefined();
            expect(video.name).toBe('First Video');
            expect(video.uploadDate).toBeInstanceOf(Date);
            expect(video.thumbnailUrl).toBe('www.fake-thumb.com');
            expect(video.category).toBe('Stretching');
            expect(video.description).toBe('Video description');
            expect(video.videoComments).toEqual([]);
        });

        // Assuming name, category, and description should not be empty.
        // These tests will fail initially, prompting the addition of validation in the Video entity.
        it('should throw an error if name is empty', () => {
            expect(() => Video.create('', 'thumb.jpg', 'cat', 'desc')).toThrow(
                'Video name cannot be empty.',
            );
        });

        it('should throw an error if category is empty', () => {
            expect(() =>
                Video.create('A Video', 'thumb.jpg', '', 'desc'),
            ).toThrow('Video category cannot be empty.');
        });
    });

    describe('Video Updates', () => {
        it('should update the thumbnail URL', () => {
            const newUrl = 'www.anotherbucket.com';
            video.updateThumbnailUrl(newUrl);
            expect(video.thumbnailUrl).toBe(newUrl);
        });

        it('should update the category', () => {
            const newCategory = 'Yoga';
            video.updateCategory(newCategory);
            expect(video.category).toBe(newCategory);
        });

        it('should throw an error if updating with an empty category', () => {
            expect(() => video.updateCategory('')).toThrow(
                'Video category cannot be empty.',
            );
        });

        it('should update the description', () => {
            const newDescription = 'New description';
            video.updateDescription(newDescription);
            expect(video.description).toBe(newDescription);
        });
    });

    describe('Comment Management', () => {
        it('should add a comment to a video', () => {
            const newComment = VideoComment.create(
                'Leonardo Tireck',
                'Great video!',
            );
            video.addComment(newComment);
            expect(video.videoComments.length).toBe(1);
            expect(video.videoComments[0]).toBe(newComment);
        });

        it('should delete a comment from a video', () => {
            const comment1 = VideoComment.create('User 1', 'Comment 1');
            const comment2 = VideoComment.create('User 2', 'Comment 2');
            video.addComment(comment1);
            video.addComment(comment2);

            video.deleteComment(comment1.id);

            expect(video.videoComments.length).toBe(1);
            expect(video.videoComments[0]).toBe(comment2);
        });

        it('should throw an error when trying to delete a non-existent comment', () => {
            const comment = VideoComment.create('User 1', 'Comment 1');
            video.addComment(comment);

            expect(() => video.deleteComment('non-existent-id')).toThrow(
                'Comment not found.',
            );
            expect(video.videoComments.length).toBe(1);
        });

        it('should return a copy of the comments array to preserve immutability', () => {
            const comment = VideoComment.create('User 1', 'Comment 1');
            video.addComment(comment);
            const comments = video.videoComments;
            comments.pop();
            expect(video.videoComments.length).toBe(1);
        });
    });
});
