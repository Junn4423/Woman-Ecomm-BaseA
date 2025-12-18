import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  // Upload single file
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    return this.storageService.uploadFile(file, folder);
  }

  // Upload multiple files
  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ) {
    return this.storageService.uploadFiles(files, folder);
  }

  // Delete file
  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.storageService.deleteFile(key);
    return { success: true };
  }

  // Get presigned upload URL
  @Post('presigned-upload')
  async getPresignedUploadUrl(
    @Body('filename') filename: string,
    @Body('contentType') contentType: string,
    @Body('folder') folder?: string,
  ) {
    return this.storageService.getPresignedUploadUrl(
      filename,
      contentType,
      folder,
    );
  }

  // Get presigned download URL
  @Post('presigned-download')
  async getPresignedDownloadUrl(@Body('key') key: string) {
    const url = await this.storageService.getPresignedDownloadUrl(key);
    return { url };
  }
}
