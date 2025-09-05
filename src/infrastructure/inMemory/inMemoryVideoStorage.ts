import { VideoStorageService } from '../../application/ports/VideoStorageService';

export class InMemoryVideoStorage implements VideoStorageService {
    private storage = new Map<string, Buffer>();

    async upload(file: Buffer, key: string): Promise<string> {
        this.storage.set(key, file);
        return `https://fake-s3.local/${key}`;
    }
    async delete(key: string): Promise<void> {
        this.storage.delete(key);
    }
    async generatePresignedUrl(key: string): Promise<string> {
        return `https://fake-s3.local/${key}`;
    }

    // this method is strictly for testing purposes.
    async getFileInMemory(key: string) {
        return this.storage.get(key);
    }

    async fileExists(key: string): Promise<boolean> {
        return this.storage.has(key);
    }
}
