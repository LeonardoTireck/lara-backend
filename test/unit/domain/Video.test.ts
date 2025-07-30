import { Video } from "../../../src/domain/Video";
import { VideoComment } from "../../../src/domain/VideoComment";

test("Should create a new video", function () {
  const input = {
    id: "fakeId",
    name: "First Video",
    thumbnailUrl: "www.fake-thumb.com",
    category: "Streaching",
    description: "Video description",
    videoBuffer: Buffer.from("fake-content"),
    thumbnailBuffer: Buffer.from("fake-thumb"),
  };
  const newVideo = Video.create(
    input.id,
    input.name,
    input.thumbnailUrl,
    input.category,
    input.description,
  );
  expect(newVideo).toBeDefined();
  expect(newVideo.id).toBeDefined();
  expect(newVideo.name).toBeDefined();
  expect(newVideo.uploadDate).toBeDefined();
  expect(newVideo.thumbnailUrl).toBeDefined();
  expect(newVideo.category).toBeDefined();
  expect(newVideo.description).toBeDefined();
  expect(newVideo.videoComments).toBeDefined();
});

test("Should update the video url", function () {
  const input = {
    id: "fakeId",
    name: "First Video",
    thumbnailUrl: "www.fake-thumb.com",
    category: "Streaching",
    description: "Video description",
    videoBuffer: Buffer.from("fake-content"),
    thumbnailBuffer: Buffer.from("fake-thumb"),
  };
  const newVideo = Video.create(
    input.id,
    input.name,
    input.thumbnailUrl,
    input.category,
    input.description,
  );
  const newUrl = "www.anotherbucket.com";

  newVideo.updateThumbailUrl(newUrl);

  expect(newVideo.thumbnailUrl).toBe("www.anotherbucket.com");
});

test("Should update the category", function () {
  const input = {
    id: "fakeId",
    name: "First Video",
    thumbnailUrl: "www.fake-thumb.com",
    category: "Streaching",
    description: "Video description",
    videoBuffer: Buffer.from("fake-content"),
    thumbnailBuffer: Buffer.from("fake-thumb"),
  };
  const newVideo = Video.create(
    input.id,
    input.name,
    input.thumbnailUrl,
    input.category,
    input.description,
  );

  const category = "Alongamento 2";

  newVideo.updateCategory(category);

  expect(newVideo.category).toBe("Alongamento 2");
});

test("Should update the description", function () {
  const input = {
    id: "fakeId",
    name: "First Video",
    thumbnailUrl: "www.fake-thumb.com",
    category: "Streaching",
    description: "Video description",
    videoBuffer: Buffer.from("fake-content"),
    thumbnailBuffer: Buffer.from("fake-thumb"),
  };
  const newVideo = Video.create(
    input.id,
    input.name,
    input.thumbnailUrl,
    input.category,
    input.description,
  );
  const description = "New description";

  newVideo.updateDescription(description);

  expect(newVideo.description).toBe("New description");
});

test("Should add a comment to a video", async () => {
  const input = {
    id: "fakeId",
    name: "First Video",
    thumbnailUrl: "www.fake-thumb.com",
    category: "Streaching",
    description: "Video description",
    videoBuffer: Buffer.from("fake-content"),
    thumbnailBuffer: Buffer.from("fake-thumb"),
  };
  const newVideo = Video.create(
    input.id,
    input.name,
    input.thumbnailUrl,
    input.category,
    input.description,
  );
  const newComment = VideoComment.create("Leonardo Tireck", "Great video!");
  newVideo.addComment(newComment);

  expect(newVideo.videoComments[0]).toBe(newComment);
});

test("Should delete a comment form a video", async () => {
  const input = {
    id: "fakeId",
    name: "First Video",
    thumbnailUrl: "www.fake-thumb.com",
    category: "Streaching",
    description: "Video description",
    videoBuffer: Buffer.from("fake-content"),
    thumbnailBuffer: Buffer.from("fake-thumb"),
  };
  const newVideo = Video.create(
    input.id,
    input.name,
    input.thumbnailUrl,
    input.category,
    input.description,
  );

  const newComment = VideoComment.create("Leonardo Tireck", "Great video!");
  newVideo.addComment(newComment);
  newVideo.deleteComment(newComment.id);
  expect(newVideo.videoComments[0]).toBe(undefined);
});
