import { GetAllVideosMetadata } from "../../../src/application/usecases/GetAllVideosMetadata.usecase";
import { UploadVideo } from "../../../src/application/usecases/UploadVideo.usecase";
import { InMemoryVideoRepository } from "../../../src/infrastructure/videoRepo/inMemory";
import { InMemoryVideoStorage } from "../../../src/infrastructure/videoStorage/inMemory";

describe("GetAllVideosMetadata Integration Test", () => {
  let useCaseGetAllVideos: GetAllVideosMetadata;

  beforeEach(async () => {
    const videoRepo = new InMemoryVideoRepository();
    useCaseGetAllVideos = new GetAllVideosMetadata(videoRepo);
    const storageService = new InMemoryVideoStorage();
    const useCaseUploadVideo = new UploadVideo(videoRepo, storageService);

    const input1 = {
      name: "First Video",
      category: "Stretching",
      description: "Video description",
      videoBuffer: Buffer.from("fake-content"),
      thumbnailBuffer: Buffer.from("fake-thumb"),
    };
    await useCaseUploadVideo.execute(input1);

    const input2 = {
      name: "Second Video",
      category: "Stretching",
      description: "Video description",
      videoBuffer: Buffer.from("fake-content"),
      thumbnailBuffer: Buffer.from("fake-thumb"),
    };
    await useCaseUploadVideo.execute(input2);
  });

  test("Should return all videos metadata", async () => {
    const videos = await useCaseGetAllVideos.execute();

    expect(videos).toHaveLength(2);
    expect(videos[0].name).toBe("First Video");
    expect(videos[1].name).toBe("Second Video");
  });
});

