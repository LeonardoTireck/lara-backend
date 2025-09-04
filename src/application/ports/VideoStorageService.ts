export interface VideoStorageService {
    upload(file: Buffer, key: string): Promise<string>;
    generatePresignedUrl(key: string): Promise<string>;
    delete(key: string): Promise<void>;
}
