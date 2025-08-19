import { AddCommentToVideo } from "../../src/application/usecases/AddCommentToVideo.usecase";
import { UploadVideo } from "../../src/application/usecases/UploadVideo.usecase";
import { InMemoryVideoRepository } from "../../src/infrastructure/videoRepo/inMemory";
import { InMemoryVideoStorage } from "../../src/infrastructure/videoStorage/inMemory";

test("Should add a comment to a video", async () => {
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

  const outputUploadvideo = await useCaseUploadVideo.execute(input);

  const useCaseAddCommentToVideo = new AddCommentToVideo(videoRepo);

  const inputForAddComment = {
    videoId: outputUploadvideo.id,
    author: "Fake User",
    text: "Fake comment",
  };

  const outputAddComment =
    await useCaseAddCommentToVideo.execute(inputForAddComment);

  expect(outputAddComment.commentId).toBeDefined();
  expect(outputAddComment.videoId).toBe(outputUploadvideo.id);
  expect(outputAddComment.author).toBe(inputForAddComment.author);
  expect(outputAddComment.text).toBe(inputForAddComment.text);
});
