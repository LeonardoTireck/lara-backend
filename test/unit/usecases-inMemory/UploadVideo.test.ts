import { UploadVideo } from '../../../src/application/usecases/UploadVideo.usecase';
import { StorageKeyBuilder } from '../../../src/domain/StorageKeyBuilder';
import { InMemoryVideoRepository } from '../../../src/infrastructure/inMemory/inMemoryVideoRepo';
import { InMemoryVideoStorage } from '../../../src/infrastructure/inMemory/inMemoryVideoStorage';

describe('UploadVideo Use Case', () => {
    let videoRepo: InMemoryVideoRepository;
    let storageService: InMemoryVideoStorage;
    let useCaseUploadVideo: UploadVideo;

    beforeEach(() => {
        videoRepo = new InMemoryVideoRepository();
        storageService = new InMemoryVideoStorage();
        useCaseUploadVideo = new UploadVideo(videoRepo, storageService);
    });

    it('should upload a new video and its thumbnail', async () => {
        const input = {
            name: 'First Video',
            category: 'Stretching',
            description: 'Video description',
            videoBuffer: Buffer.from('fake-video-content'),
            thumbnailBuffer: Buffer.from('fake-thumbnail-content'),
        };

        const videoOutput = await useCaseUploadVideo.execute(input);

        expect(videoOutput).toBeDefined();
        expect(videoOutput.id).toBeDefined();
        expect(videoOutput.name).toBe(input.name);
        expect(videoOutput.category).toBe(input.category);
        expect(videoOutput.description).toBe(input.description);
        expect(videoOutput.uploadDate).toBeInstanceOf(Date);

        const videoKey = StorageKeyBuilder.build(
            'video',
            input.name,
            videoOutput.id,
        );
        const thumbnailKey = StorageKeyBuilder.build(
            'thumbnail',
            input.name,
            videoOutput.id,
        );

        expect(videoOutput.videoUrl).toBe(`https://fake-s3.local/${videoKey}`);
        expect(videoOutput.thumbnailUrl).toBe(
            `https://fake-s3.local/${thumbnailKey}`,
        );

        const storedVideo = await storageService.getFileInMemory(videoKey);
        expect(storedVideo?.toString()).toBe(input.videoBuffer.toString());

        const storedThumbnail =
            await storageService.getFileInMemory(thumbnailKey);
        expect(storedThumbnail?.toString()).toBe(
            input.thumbnailBuffer.toString(),
        );

        const savedVideoMetadata = await videoRepo.findById(videoOutput.id);
        expect(savedVideoMetadata).toBeDefined();
        expect(savedVideoMetadata?.name).toBe(input.name);
        expect(savedVideoMetadata?.category).toBe(input.category);
        expect(savedVideoMetadata?.description).toBe(input.description);
        expect(savedVideoMetadata?.thumbnailUrl).toBe(videoOutput.thumbnailUrl);
    });

    it('should throw an error if video name is empty', async () => {
        const input = {
            name: '',
            category: 'Stretching',
            description: 'Video description',
            videoBuffer: Buffer.from('fake-video-content'),
            thumbnailBuffer: Buffer.from('fake-thumbnail-content'),
        };

        await expect(useCaseUploadVideo.execute(input)).rejects.toThrow(
            'Video name cannot be empty.',
        );
    });

    it('should throw an error if video category is empty', async () => {
        const input = {
            name: 'Valid Name',
            category: '', // Invalid category
            description: 'Video description',
            videoBuffer: Buffer.from('fake-video-content'),
            thumbnailBuffer: Buffer.from('fake-thumbnail-content'),
        };

        await expect(useCaseUploadVideo.execute(input)).rejects.toThrow(
            'Video category cannot be empty.',
        );
    });
});
