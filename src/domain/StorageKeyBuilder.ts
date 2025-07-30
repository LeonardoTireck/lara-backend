export class StorageKeyBuilder {
  static build(type: "video" | "thumbnail", name: string, id: string): string {
    const safeName = name.replace(/\s+/g, "_");
    const extension = type === "video" ? "mp4" : "jpg";
    return `${type}s/${id}_${safeName}.${extension}`;
  }
}
