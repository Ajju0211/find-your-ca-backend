import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { readdir, writeFile, unlink } from 'fs/promises'; // Import writeFile
import type { Multer } from 'multer';

@Controller('upload')
export class UploadController {
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Store file in memory first
    }),
  )
  async uploadFile(
    @UploadedFile() file: Multer.File,
    @Body('type') type: string,
  ) {
    const finalType = type || 'unknown';
    console.log('Final received type:', finalType, file);

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = extname(file.originalname);
    const fileName = `${finalType}_${file.originalname}_${uniqueSuffix}${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      // Save the file manually to "uploads" folder
      await writeFile(filePath, file.buffer);
      console.log(`File saved successfully: ${filePath}`);

      return {
        filename: fileName,
        path: `/${filePath}`,
        type: finalType,
      };
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('File upload failed');
    }
  }
}
