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
    videoBuffer: Buffer.from("fake-content"),
    thumbnailBuffer: Buffer.from("fake-thumb"),
  };

  const nameWithUnderscore = input.name.replace(" ", "_");

  const video = await useCaseUploadVideo.execute(input);

  expect(video).toBeDefined();
  expect(video.thumbnailUrl).toBe(
    `https://fake-s3.local/thumbnails/${video.id}_${nameWithUnderscore}.jpg`,
  );
  expect(video.videoUrl).toBe(
    `https://fake-s3.local/videos/${video.id}_${nameWithUnderscore}.mp4`,
  );
  expect(video.category).toBe("Streaching");
});
