import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiTags, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ✅ Upload image only
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    return this.uploadService.uploadImageToR2(image); // <-- clean, type-safe
  }

  // 🗑 Delete image
  @Delete('image/:key')
  @ApiParam({ name: 'key', description: 'Image file key' })
  async deleteImage(@Param('key') key: string) {
    return this.uploadService.deleteFromR2(`images/${key}`);
  }

  // ✅ Upload general file (not image)
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFileToR2(file); // <-- rejects images internally
  }

  // 🗑 Delete file
  @Delete('file/:key')
  @ApiParam({ name: 'key', description: 'File key' })
  async deleteFile(@Param('key') key: string) {
    return this.uploadService.deleteFromR2(`files/${key}`);
  }
}
