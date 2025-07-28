import { Comment } from "./Comment";
import crypto from "crypto";

export class Video {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly uploadDate: Date,
    private _videoUrl: string,
    private _category: string,
    private _description: string,
    private _comments: Comment[] = [],
  ) {}

  static create(
    name: string,
    videoUrl: string,
    category: string,
    description: string,
  ) {
    const id = crypto.randomUUID();
    return new Video(id, name, new Date(), videoUrl, category, description);
  }

  get videoUrl() {
    return this._videoUrl;
  }

  get category() {
    return this._category;
  }
  get description() {
    return this._description;
  }
  get comments() {
    return [...this._comments];
  }

  updateVideoUrl(newUrl: string) {
    this._videoUrl = newUrl;
  }

  updateCategory(category: string) {
    this._category = category;
  }

  updateDescription(description: string) {
    this._description = description;
  }

  addComment(comment: Comment) {
    this._comments.push(comment);
  }

  deleteComment(commentId: string) {
    const commentIndex = this._comments.findIndex(
      (comment) => comment.id == commentId,
    );
    if (commentIndex === undefined) throw new Error("Comment not found.");
    this._comments.splice(commentIndex, 1);
  }
}
