import { GetVideo } from "../../src/application/usecases/GetVideo.usecase";
import { InMemoryVideoRepository } from "../../src/infrastructure/videoRepo/inMemory";

test("Should return all videos", async () => {
  const videoRepo = new InMemoryVideoRepository();
  const useCaseGetAllVideos = new GetVideo(videoRepo);
});
