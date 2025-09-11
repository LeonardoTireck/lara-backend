import crypto from 'crypto';
import { VideoComment } from '../Entities/VideoComment';

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
        if (!name) throw new Error('Video name cannot be empty.');
        if (!category) throw new Error('Video category cannot be empty.');
        const id = crypto.randomUUID();
        return new Video(
            id,
            name,
            new Date(),
            thumbnailUrl,
            category,
            description,
        );
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
        this._thumbnailUrl = newUrl;
    }

    updateCategory(category: string) {
        if (!category) throw new Error('Video category cannot be empty.');
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
        if (commentIndex === -1) throw new Error('Comment not found.');
        this._videoComments.splice(commentIndex, 1);
    }
}
