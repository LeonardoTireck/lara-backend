import { VideoComment } from "./VideoComment";
import crypto from "crypto";

export class Video {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly uploadDate: Date,
    private _thumbnailUrl: string,
    private _category: string,
    private _description: string,
    private _videoComments: VideoComment[] = [],
  ) {}

  static create(
    name: string,
    thumbnailUrl: string,
    category: string,
    description: string,
  ) {
    const id = crypto.randomUUID();
    return new Video(id, name, new Date(), thumbnailUrl, category, description);
  }

  get thumbnailUrl() {
    return this._thumbnailUrl;
  }

  get category() {
    return this._category;
  }
  get description() {
    return this._description;
  }
  get videoComments() {
    return [...this._videoComments];
  }

  updateThumbailUrl(newUrl: string) {
    this._thumbnailUrl = newUrl;
  }

  updateCategory(category: string) {
    this._category = category;
  }

  updateDescription(description: string) {
    this._description = description;
  }

  addComment(comment: VideoComment) {
    this._videoComments.push(comment);
  }

  deleteComment(commentId: string) {
    const commentIndex = this._videoComments.findIndex(
      (comment) => comment.id == commentId,
    );
    if (commentIndex === undefined) throw new Error("Comment not found.");
    this._videoComments.splice(commentIndex, 1);
  }
}
