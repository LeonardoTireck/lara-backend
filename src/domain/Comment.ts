import crypto from "crypto";

export class Comment {
  private constructor(
    readonly id: string,
    readonly author: string,
    readonly text: string,
  ) {}
  static create(author: string, text: string) {
    const id = crypto.randomUUID();
    return new Comment(id, author, text);
  }
}
