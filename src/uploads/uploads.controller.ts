// src/uploads/uploads.controller.ts
import {
  Controller,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';
import { CloudinaryService } from './cloudinary.service';
import path from 'path';
import { UploadApiResponse } from 'cloudinary';

@Controller('upload')
export class UploadsController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerOptions)) // For all files
  // OR
  @UseInterceptors(FileFieldsInterceptor([{ name: 'video' }, { name: 'image' }], multerOptions))

  async handleUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ): Promise<Response> {
    const uploads: UploadApiResponse[] = [];

    for (const file of files) {
      const ext: string = path.extname(file.originalname).toLowerCase();
      const isImage: boolean = /jpeg|jpg|png|gif/.test(ext);

      const publicId: string = file.filename.split('.')[0];
      const folder: string = file.fieldname + 's';

      const result: UploadApiResponse = isImage
        ? await this.cloudinaryService.uploadImage(file.path, publicId, folder)
        : await this.cloudinaryService.uploadVideo(file.path, publicId, folder);

      uploads.push(result);
    }

    return res.status(200).json({ message: 'Upload successful', uploads });
  }
}
