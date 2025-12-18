import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * FPT Storage Client using AWS SDK v3
 * FPT Storage is S3-compatible, so we use AWS SDK with custom endpoint
 */
export class FptStorageClient {
    private client: S3Client;
    private bucketName: string;

    constructor(config?: {
        accessKeyId?: string;
        secretAccessKey?: string;
        endpoint?: string;
        region?: string;
        bucketName?: string;
    }) {
        this.bucketName = config?.bucketName || process.env.FPT_BUCKET_NAME || '';

        this.client = new S3Client({
            region: config?.region || process.env.FPT_REGION || 'vietnam',
            endpoint: config?.endpoint || process.env.FPT_ENDPOINT || 'https://s3.fpt.vn',
            credentials: {
                accessKeyId: config?.accessKeyId || process.env.FPT_ACCESS_KEY || '',
                secretAccessKey: config?.secretAccessKey || process.env.FPT_SECRET_KEY || '',
            },
            forcePathStyle: true, // Required for some S3-compatible storages
        });
    }

    /**
     * Upload a file to FPT Storage
     */
    async upload(
        key: string,
        body: Buffer | Uint8Array | string,
        contentType?: string,
        metadata?: Record<string, string>,
    ): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
            Metadata: metadata,
            ACL: 'public-read',
        });

        await this.client.send(command);

        return this.getPublicUrl(key);
    }

    /**
     * Upload a file with presigned URL (for client-side uploads)
     */
    async getUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
            ACL: 'public-read',
        });

        return getSignedUrl(this.client, command, { expiresIn });
    }

    /**
     * Get download URL (for private files)
     */
    async getDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        return getSignedUrl(this.client, command, { expiresIn });
    }

    /**
     * Delete a file
     */
    async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        await this.client.send(command);
    }

    /**
     * List files in a directory
     */
    async list(prefix?: string): Promise<string[]> {
        const command = new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: prefix,
        });

        const response = await this.client.send(command);
        return response.Contents?.map((item) => item.Key || '') || [];
    }

    /**
     * Get public URL for a file
     */
    getPublicUrl(key: string): string {
        const endpoint = process.env.FPT_ENDPOINT || 'https://s3.fpt.vn';
        return `${endpoint}/${this.bucketName}/${key}`;
    }
}

// Strapi Upload Provider for FPT Storage
export const strapiUploadProvider = {
    init(config: any) {
        const client = new FptStorageClient({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            endpoint: config.endpoint,
            region: config.region,
            bucketName: config.bucketName,
        });

        return {
            async upload(file: any) {
                const key = `uploads/${file.hash}${file.ext}`;
                const url = await client.upload(key, file.buffer, file.mime);
                file.url = url;
            },

            async uploadStream(file: any) {
                // Convert stream to buffer for upload
                const chunks: Buffer[] = [];
                for await (const chunk of file.stream) {
                    chunks.push(chunk);
                }
                const buffer = Buffer.concat(chunks);

                const key = `uploads/${file.hash}${file.ext}`;
                const url = await client.upload(key, buffer, file.mime);
                file.url = url;
            },

            async delete(file: any) {
                const key = `uploads/${file.hash}${file.ext}`;
                await client.delete(key);
            },
        };
    },
};

export default FptStorageClient;
