import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly cdnUrl: string;
  private readonly endpoint: string;

  constructor(private configService: ConfigService) {
    const storageConfig = this.configService.get('storage');

    if (
      !storageConfig?.endpoint ||
      !storageConfig?.accessKey ||
      !storageConfig?.secretKey ||
      !storageConfig?.bucket
    ) {
      throw new Error('Storage configuration is missing required values');
    }

    this.s3Client = new S3Client({
      region: storageConfig.region,
      endpoint: storageConfig.endpoint,
      credentials: {
        accessKeyId: storageConfig.accessKey,
        secretAccessKey: storageConfig.secretKey,
      },
      forcePathStyle: true, // Required for FPT Storage and other S3-compatible services
    });

    this.bucket = storageConfig.bucket;
    this.cdnUrl = storageConfig.cdnUrl;
    this.endpoint = storageConfig.endpoint;
  }

  // Upload file
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds limit (5MB)');
    }

    // Generate unique filename
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const key = `${folder}/${filename}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      const url = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : this.endpoint
        ? `${this.endpoint}/${this.bucket}/${key}`
        : `https://${this.bucket}.s3.amazonaws.com/${key}`;

      this.logger.log(`File uploaded: ${key}`);

      return { url, key };
    } catch (error) {
      this.logger.error('Error uploading file', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads',
  ): Promise<Array<{ url: string; key: string }>> {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(file, folder)),
    );
    return results;
  }

  // Delete file
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted: ${key}`);
    } catch (error) {
      this.logger.error('Error deleting file', error);
      throw error;
    }
  }

  // Generate presigned URL for direct upload
  async getPresignedUploadUrl(
    filename: string,
    contentType: string,
    folder: string = 'uploads',
  ): Promise<{ uploadUrl: string; key: string; fileUrl: string }> {
    const ext = path.extname(filename);
    const uniqueFilename = `${uuidv4()}${ext}`;
    const key = `${folder}/${uniqueFilename}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      const fileUrl = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : `https://${this.bucket}.s3.amazonaws.com/${key}`;

      return { uploadUrl, key, fileUrl };
    } catch (error) {
      this.logger.error('Error generating presigned URL', error);
      throw error;
    }
  }

  // Generate presigned URL for download
  async getPresignedDownloadUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      return url;
    } catch (error) {
      this.logger.error('Error generating presigned download URL', error);
      throw error;
    }
  }
}
