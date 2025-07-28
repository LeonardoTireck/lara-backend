import crypto from "crypto";

export class VideoComment {
  private constructor(
    readonly id: string,
    readonly author: string,
    readonly text: string,
  ) {}
  static create(author: string, text: string) {
    const id = crypto.randomUUID();
    return new VideoComment(id, author, text);
  }
}
