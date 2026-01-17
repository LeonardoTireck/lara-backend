import crypto from 'crypto';
import { NotFoundError, ValidationError } from '../../error/appError';
import { VideoComment } from './videoComment';

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
    if (!name) throw new ValidationError('Video name cannot be empty.');
    if (!category) throw new ValidationError('Video category cannot be empty.');
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

  updateThumbnailUrl(newUrl: string) {
    if (!newUrl) throw new ValidationError('Url cannot be empty.');
    this._thumbnailUrl = newUrl;
  }

  updateCategory(category: string) {
    if (!category) throw new ValidationError('Video category cannot be empty.');
    this._category = category;
  }

  updateDescription(description: string) {
    if (!description)
      throw new ValidationError('Video description cannot be empty.');
    this._description = description;
  }

  addComment(comment: VideoComment) {
    if (!comment) throw new ValidationError('Comment cannot be empty.');
    this._videoComments.push(comment);
  }

  deleteComment(commentId: string) {
    const commentIndex = this._videoComments.findIndex(
      (comment) => comment.id == commentId,
    );
    if (commentIndex === -1) throw new NotFoundError('Comment');
    this._videoComments.splice(commentIndex, 1);
  }
}
