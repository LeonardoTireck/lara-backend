import crypto from "crypto";
import { VideoComment } from "./VideoComment";

export class Video {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly uploadDate: Date,
    private _videoUrl: string,
    private _category: string,
    private _description: string,
    private _videoComments: VideoComment[] = [],
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
  get videoComments() {
    return [...this._videoComments];
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
