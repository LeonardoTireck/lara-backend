import { GetAllVideosMetadata } from '../../../src/video/application/usecase/getAllVideosMetadata.usecase';
import { UploadVideo } from '../../../src/video/application/usecase/uploadVideo.usecase';
import { InMemoryVideoRepository } from '../../../src/infrastructure/inMemory/inMemoryVideoRepo';
import { InMemoryVideoStorage } from '../../../src/infrastructure/inMemory/inMemoryVideoStorage';

describe('GetAllVideosMetadata Use Case', () => {
  let videoRepo: InMemoryVideoRepository;
  let useCaseGetAllVideos: GetAllVideosMetadata;

  beforeEach(() => {
    videoRepo = new InMemoryVideoRepository();
    useCaseGetAllVideos = new GetAllVideosMetadata(videoRepo);
  });

  it('should return all videos metadata', async () => {
    const storageService = new InMemoryVideoStorage();
    const useCaseUploadVideo = new UploadVideo(videoRepo, storageService);

    const input1 = {
      name: 'First Video',
      category: 'Stretching',
      description: 'Video description',
      videoBuffer: Buffer.from('fake-content-1'),
      thumbnailBuffer: Buffer.from('fake-thumb-1'),
    };
    const video1 = await useCaseUploadVideo.execute(input1);

    const input2 = {
      name: 'Second Video',
      category: 'Yoga',
      description: 'Another description',
      videoBuffer: Buffer.from('fake-content-2'),
      thumbnailBuffer: Buffer.from('fake-thumb-2'),
    };
    const video2 = await useCaseUploadVideo.execute(input2);

    const videos = await useCaseGetAllVideos.execute();

    expect(videos).toHaveLength(2);
    expect(videos[0].id).toBe(video1.id);
    expect(videos[0].name).toBe(video1.name);
    expect(videos[0].category).toBe(video1.category);
    expect(videos[0].description).toBe(video1.description);
    expect(videos[0].thumbnailUrl).toBe(video1.thumbnailUrl);
    expect(videos[0].uploadDate).toBeInstanceOf(Date);
    expect(videos[0].comments).toEqual([]);

    expect(videos[1].id).toBe(video2.id);
    expect(videos[1].name).toBe(video2.name);
    expect(videos[1].category).toBe(video2.category);
    expect(videos[1].description).toBe(video2.description);
    expect(videos[1].thumbnailUrl).toBe(video2.thumbnailUrl);
    expect(videos[1].uploadDate).toBeInstanceOf(Date);
    expect(videos[1].comments).toEqual([]);
  });

  it('should return an empty array if no videos are found', async () => {
    const result = await useCaseGetAllVideos.execute();
    expect(result).toEqual([]);
  });
});
