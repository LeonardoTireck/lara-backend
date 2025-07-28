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
  console.log(newVideo);
  expect(newVideo).toBeDefined();
  expect(newVideo.id).toBeDefined();
  expect(newVideo.name).toBeDefined();
  expect(newVideo.uploadDate).toBeDefined();
  expect(newVideo.videoUrl).toBeDefined();
  expect(newVideo.category).toBeDefined();
  expect(newVideo.description).toBeDefined();
  expect(newVideo.comments).toBeDefined();
});
