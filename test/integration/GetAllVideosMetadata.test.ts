import { GetAllVideosMetadata } from "../../src/application/usecases/GetAllVideosMetadata.usecase";
import { UploadVideo } from "../../src/application/usecases/UploadVideo.usecase";
import { InMemoryVideoRepository } from "../../src/infrastructure/videoRepo/inMemory";
import { InMemoryVideoStorage } from "../../src/infrastructure/videoStorage/inMemory";

test("Should return all videos metadata", async () => {
  const videoRepo = new InMemoryVideoRepository();
  const useCaseGetAllVideos = new GetAllVideosMetadata(videoRepo);
  const storageService = new InMemoryVideoStorage();
  const useCaseUploadVideo = new UploadVideo(videoRepo, storageService);

  const input = {
    name: "First Video",
    category: "Streaching",
    description: "Video description",
    fileBuffer: Buffer.from("fake-content"),
    fileName: "firstvideo",
  };

  await useCaseUploadVideo.execute(input);

  const input2 = {
    name: "Second Video",
    category: "Exercise",
    description: "Video description",
    fileBuffer: Buffer.from("fake-content"),
    fileName: "secondvideo",
  };

  await useCaseUploadVideo.execute(input2);

  const videos = await useCaseGetAllVideos.execute();

  expect(videos).toHaveLength(2);
  expect(videos[0].name).toBe("First Video");
  expect(videos[1].name).toBe("Second Video");
});
