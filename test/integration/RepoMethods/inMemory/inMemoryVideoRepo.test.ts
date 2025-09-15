import { NotFoundError } from '../../../../src/application/errors/AppError';
import { Video } from '../../../../src/domain/Aggregates/Video';
import { InMemoryVideoRepository } from '../../../../src/infrastructure/inMemory/inMemoryVideoRepo';

describe('InMemoryVideoRepository', () => {
  let repository: InMemoryVideoRepository;

  beforeEach(() => {
    repository = new InMemoryVideoRepository();
  });

  it('should save a video', async () => {
    const video = Video.create('Test Video', 'url', 'category', 'A test video');
    await repository.save(video);
    expect(repository.videos).toHaveLength(1);
    expect(repository.videos[0].id).toBe(video.id);
  });

  it('should find all videos', async () => {
    const video1 = Video.create(
      'Test Video 1',
      'url1',
      'category1',
      'A test video 1',
    );
    const video2 = Video.create(
      'Test Video 2',
      'url2',
      'category2',
      'A test video 2',
    );
    await repository.save(video1);
    await repository.save(video2);

    const videos = await repository.findAll();
    expect(videos).toHaveLength(2);
    expect(videos?.[0].id).toBe(video1.id);
    expect(videos?.[1].id).toBe(video2.id);
  });

  it('should find a video by id', async () => {
    const video = Video.create('Test Video', 'url', 'category', 'A test video');
    await repository.save(video);

    const foundVideo = await repository.findById(video.id);
    expect(foundVideo?.id).toBe(video.id);
  });

  it('should return undefined if video not found by id', async () => {
    const foundVideo = await repository.findById('non-existent-id');
    expect(foundVideo).toBeUndefined();
  });

  it('should update a video', async () => {
    const video = Video.create('Test Video', 'url', 'category', 'A test video');
    await repository.save(video);

    video.updateDescription('Updated description');
    video.updateThumbnailUrl('updated_url');
    video.updateCategory('updated_category');

    await repository.update(video);

    const foundVideo = await repository.findById(video.id);
    expect(foundVideo?.description).toBe('Updated description');
    expect(foundVideo?.thumbnailUrl).toBe('updated_url');
    expect(foundVideo?.category).toBe('updated_category');
  });

  it('should throw error if video not found for update', async () => {
    const video = Video.create('Test Video', 'url', 'category', 'A test video');
    await expect(repository.update(video)).rejects.toThrow(NotFoundError);
  });

  it('should delete a video', async () => {
    const video = Video.create('Test Video', 'url', 'category', 'A test video');
    await repository.save(video);
    expect(repository.videos).toHaveLength(1);

    await repository.delete(video.id);
    expect(repository.videos).toHaveLength(0);
  });

  it('should throw error if video not found for delete', async () => {
    await expect(repository.delete('non-existent-id')).rejects.toThrow(
      NotFoundError,
    );
  });
});
