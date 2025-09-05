import { UpdateThumbnail } from '../../../src/application/usecases/UpdateThumbnail.usecase';
import { UploadVideo } from '../../../src/application/usecases/UploadVideo.usecase';
import { StorageKeyBuilder } from '../../../src/domain/StorageKeyBuilder';
import { InMemoryVideoRepository } from '../../../src/infrastructure/inMemory/inMemoryVideoRepo';
import { InMemoryVideoStorage } from '../../../src/infrastructure/inMemory/inMemoryVideoStorage';

describe('UpdateThumbnail Use Case', () => {
    let metadataRepo: InMemoryVideoRepository;
    let storageService: InMemoryVideoStorage;
    let updateThumbnailUseCase: UpdateThumbnail;
    let videoId: string;
    let originalThumbnailKey: string;

    beforeEach(async () => {
        metadataRepo = new InMemoryVideoRepository();
        storageService = new InMemoryVideoStorage();
        updateThumbnailUseCase = new UpdateThumbnail(
            storageService,
            metadataRepo,
        );
        const uploadVideoUseCase = new UploadVideo(
            metadataRepo,
            storageService,
        );

        const inputUploadVideo = {
            name: 'First Video',
            category: 'Stretching',
            description: 'Video description',
            videoBuffer: Buffer.from('fake-content'),
            thumbnailBuffer: Buffer.from('fake-thumb'),
        };
        const outputUploadVideo =
            await uploadVideoUseCase.execute(inputUploadVideo);
        videoId = outputUploadVideo.id;
        originalThumbnailKey = StorageKeyBuilder.build(
            'thumbnail',
            inputUploadVideo.name,
            videoId,
        );
    });

    it('should upload a new thumbnail to storage and update metadata', async () => {
        const newThumbnailBuffer = Buffer.from('new thumbnail');

        const outputUpdateThumbnail = await updateThumbnailUseCase.execute(
            videoId,
            newThumbnailBuffer,
        );

        const newThumbnailKey = StorageKeyBuilder.build(
            'thumbnail',
            (await metadataRepo.findById(videoId))!.name,
            videoId,
        );

        const storedNewThumbnail =
            await storageService.getFileInMemory(newThumbnailKey);
        expect(storedNewThumbnail?.toString()).toBe(
            newThumbnailBuffer.toString(),
        );

        expect(await storageService.fileExists(originalThumbnailKey)).toBe(
            true,
        ); // Key still exists
        expect(
            (
                await storageService.getFileInMemory(originalThumbnailKey)
            )?.toString(),
        ).toBe(newThumbnailBuffer.toString());

        const updatedVideo = await metadataRepo.findById(videoId);
        expect(updatedVideo?.thumbnailUrl).toBe(
            `https://fake-s3.local/${newThumbnailKey}`,
        );
        expect(outputUpdateThumbnail.id).toBe(videoId);
        expect(outputUpdateThumbnail.thumbnailUrl).toBe(
            `https://fake-s3.local/${newThumbnailKey}`,
        );
    });

    it('should throw an error if the video is not found', async () => {
        const nonExistentVideoId = 'non-existent-video-id';
        const newThumbnailBuffer = Buffer.from('new thumbnail');

        await expect(
            updateThumbnailUseCase.execute(
                nonExistentVideoId,
                newThumbnailBuffer,
            ),
        ).rejects.toThrow('Video not found.');
    });
});
