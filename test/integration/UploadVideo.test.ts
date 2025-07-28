import { UploadVideo } from "../../src/application/usecases/UploadVideo.usecase";
import { InMemoryVideoRepository } from "../../src/infrastructure/videoRepo/inMemory";
import { InMemoryVideoStorage } from "../../src/infrastructure/videoStorage/inMemory";

test("Should upload a new video in memory", async () => {
  const videoRepo = new InMemoryVideoRepository();
  const storageService = new InMemoryVideoStorage();
  const useCaseUploadVideo = new UploadVideo(videoRepo, storageService);

  const input = {
    name: "First Video",
    category: "Streaching",
    description: "Video description",
    fileBuffer: Buffer.from("fake-content"),
    fileName: "firstvideo",
  };

  const video = await useCaseUploadVideo.execute(input);

  expect(video).toBeDefined();
  expect(video.videoUrl).toBe("https://fake-s3.local/firstvideo");
  expect(video.category).toBe("Streaching");
});
