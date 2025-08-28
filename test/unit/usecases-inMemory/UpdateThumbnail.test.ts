import { UpdateThumbnail } from "../../../src/application/usecases/UpdateThumbnail.usecase";
import { UploadVideo } from "../../../src/application/usecases/UploadVideo.usecase";
import { StorageKeyBuilder } from "../../../src/domain/StorageKeyBuilder";
import { InMemoryVideoRepository } from "../../../src/infrastructure/videoRepo/inMemory";
import { InMemoryVideoStorage } from "../../../src/infrastructure/videoStorage/inMemory";

describe("UpdateThumbnail Integration Test", () => {
  let metadataRepo: InMemoryVideoRepository;
  let storageService: InMemoryVideoStorage;
  let updateThumbnailUseCase: UpdateThumbnail;
  let outputUploadVideo: { id: string; name: string; thumbnailUrl: string };

  beforeEach(async () => {
    metadataRepo = new InMemoryVideoRepository();
    storageService = new InMemoryVideoStorage();
    updateThumbnailUseCase = new UpdateThumbnail(storageService, metadataRepo);
    const uploadVideoUseCase = new UploadVideo(metadataRepo, storageService);

    const inputUploadVideo = {
      name: "First Video",
      category: "Stretching",
      description: "Video description",
      videoBuffer: Buffer.from("fake-content"),
      thumbnailBuffer: Buffer.from("fake-thumb"),
    };
    outputUploadVideo = await uploadVideoUseCase.execute(inputUploadVideo);
  });

  test("Should upload a new thumbnail to storage and then update the metadata repo", async () => {
    const inputUpdateThumbnail = {
      videoId: outputUploadVideo.id,
      newThumbnail: Buffer.from("new thumbnail"),
    };

    const outputUpdateThumbnail = await updateThumbnailUseCase.execute(
      inputUpdateThumbnail.videoId,
      inputUpdateThumbnail.newThumbnail,
    );

    const key = StorageKeyBuilder.build(
      "thumbnail",
      outputUploadVideo.name,
      outputUploadVideo.id,
    );

    const newThumbnail = await storageService.getFileInMemory(key);

    expect(newThumbnail!.toString()).toBe(
      inputUpdateThumbnail.newThumbnail.toString(),
    );
    expect(outputUpdateThumbnail.id).toBe(outputUploadVideo.id);
    expect(outputUpdateThumbnail.thumbnailUrl).toBe(
      outputUploadVideo.thumbnailUrl,
    );
  });
});

