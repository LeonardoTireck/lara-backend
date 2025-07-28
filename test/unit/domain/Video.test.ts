import { Comment } from "../../../src/domain/Comment";
import { Video } from "../../../src/domain/Video";

test("Should create a new video", function () {
  const input = {
    name: "New Video",
    videoUrl: "www.s3.com",
    category: "Alongamento",
    description: "Alongamento estatico simples de posterior de coxas",
  };
  const newVideo = Video.create(
    input.name,
    input.videoUrl,
    input.category,
    input.description,
  );
  expect(newVideo).toBeDefined();
  expect(newVideo.id).toBeDefined();
  expect(newVideo.name).toBeDefined();
  expect(newVideo.uploadDate).toBeDefined();
  expect(newVideo.videoUrl).toBeDefined();
  expect(newVideo.category).toBeDefined();
  expect(newVideo.description).toBeDefined();
  expect(newVideo.comments).toBeDefined();
});

test("Should update the video url", function () {
  const input = {
    name: "New Video",
    videoUrl: "www.s3.com",
    category: "Alongamento",
    description: "Alongamento estatico simples de posterior de coxas",
  };
  const newVideo = Video.create(
    input.name,
    input.videoUrl,
    input.category,
    input.description,
  );
  const newUrl = "www.anotherbucket.com";

  newVideo.updateVideoUrl(newUrl);

  expect(newVideo.videoUrl).toBe("www.anotherbucket.com");
});

test("Should update the category", function () {
  const input = {
    name: "New Video",
    videoUrl: "www.s3.com",
    category: "Alongamento",
    description: "Alongamento estatico simples de posterior de coxas",
  };
  const newVideo = Video.create(
    input.name,
    input.videoUrl,
    input.category,
    input.description,
  );
  const category = "Alongamento 2";

  newVideo.updateCategory(category);

  expect(newVideo.category).toBe("Alongamento 2");
});

test("Should update the description", function () {
  const input = {
    name: "New Video",
    videoUrl: "www.s3.com",
    category: "Alongamento",
    description: "Alongamento estatico simples de posterior de coxas",
  };
  const newVideo = Video.create(
    input.name,
    input.videoUrl,
    input.category,
    input.description,
  );
  const description = "New description";

  newVideo.updateDescription(description);

  expect(newVideo.description).toBe("New description");
});

test("Should add a comment to a video", async () => {
  const input = {
    name: "New Video",
    videoUrl: "www.s3.com",
    category: "Alongamento",
    description: "Alongamento estatico simples de posterior de coxas",
  };

  const newVideo = Video.create(
    input.name,
    input.videoUrl,
    input.category,
    input.description,
  );

  const newComment = Comment.create("Leonardo Tireck", "Great video!");
  newVideo.addComment(newComment);

  expect(newVideo.comments[0]).toBe(newComment);
});

test("Should delete a comment form a video", async () => {
  const input = {
    name: "New Video",
    videoUrl: "www.s3.com",
    category: "Alongamento",
    description: "Alongamento estatico simples de posterior de coxas",
  };

  const newVideo = Video.create(
    input.name,
    input.videoUrl,
    input.category,
    input.description,
  );

  const newComment = Comment.create("Leonardo Tireck", "Great video!");
  newVideo.addComment(newComment);
  newVideo.deleteComment(newComment.id);
  expect(newVideo.comments[0]).toBe(undefined);
});
