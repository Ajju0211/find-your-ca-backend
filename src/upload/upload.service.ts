// src/upload/upload.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sharp from 'sharp';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });

    this.bucket = process.env.R2_BUCKET || '';
  }

  // ✅ Upload one or more images to R2
  async uploadImageToR2(
    fileOrFiles: Express.Multer.File | Express.Multer.File[],
  ) {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

    const results = await Promise.all(
      files.map(async (file) => {
        // ✅ Step 1: Validate MIME type to ensure it's an image
        if (!file.mimetype.startsWith('image/')) {
          throw new InternalServerErrorException(
            'Only image files are allowed.',
          );
        }

        // ✅ Step 2: Get file extension based on MIME type
        const fileExt = mime.extension(file.mimetype) || 'bin';

        // ✅ Step 3: Define a whitelist of allowed profile image extensions
        const allowedExts = ['jpg', 'jpeg', 'png'];

        // ✅ Step 4: If the extension is not in the allowed list, reject
        if (!allowedExts.includes(fileExt)) {
          throw new InternalServerErrorException(
            `Only ${allowedExts.join(', ').toUpperCase()} images are allowed.`,
          );
        }

        // ✅ Step 5: Compress the image with sharp (resize + quality control)
        let compressedBuffer: Buffer;
        try {
          compressedBuffer = await sharp(file.buffer)
            .resize({ width: 1280 }) // Optional: resize width
            .toFormat('avif', { quality: 75 }) // Convert to AVIF
            .toBuffer();
        } catch (err) {
          console.error('❌ Image compression failed:', err);
          throw new InternalServerErrorException('Image compression failed');
        }

        const originalName = file.originalname;
        const nameWithoutExtension = originalName
          .split('.')
          .slice(0, -1)
          .join('.');

        // ✅ Step 6: Generate a unique key for the image
        const key = `image-${nameWithoutExtension}-${uuidv4()}.avif`; // Save as .jpeg regardless of original format

        // ✅ Step 7: Upload to R2 with compressed buffer
        return this.uploadToR2(
          {
            ...file,
            buffer: compressedBuffer,
            mimetype: 'image/avif',
          },
          key,
        );
      }),
    );

    // ✅ Return single or multiple depending on input
    return Array.isArray(fileOrFiles) ? results : results[0];
  }

  // ✅ Upload general file only (non-images)
  async uploadFileToR2(file: Express.Multer.File) {
    if (file.mimetype.startsWith('image/')) {
      throw new InternalServerErrorException(
        'Image files are not allowed here.',
      );
    }

    const fileExt = mime.extension(file.mimetype) || 'bin';
    const allowedExts = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];

    if (!allowedExts.includes(fileExt)) {
      throw new InternalServerErrorException(
        `Only ${allowedExts.join(', ').toUpperCase()} files are allowed.`,
      );
    }

    let bufferToUpload = file.buffer;

    if (fileExt === 'pdf') {
      try {
        const pdfDoc = await PDFDocument.load(file.buffer, {
          updateMetadata: true,
        });

        const compressedPdf = await pdfDoc.save({
          useObjectStreams: true,
        });

        bufferToUpload = Buffer.from(compressedPdf);

        console.log(
          `PDF compressed (light): ${file.buffer.length / 1024} KB ➡ ${bufferToUpload.length / 1024} KB`,
        );
      } catch (error) {
        console.warn('⚠️ PDF compression failed. Using original file.');
      }
    }

    const originalName = file.originalname;
    const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.');

    const key = `files/${nameWithoutExtension}-${uuidv4()}.${fileExt}`;
    const uploaded = await this.uploadToR2(
      { ...file, buffer: bufferToUpload },
      key,
    );

    // ✅ Return full metadata to frontend
    return {
      url: uploaded.url,
      key: key,
      name: file.originalname,
      size: bufferToUpload.length,
      mimeType: file.mimetype,
      extension: fileExt,
    };
  }

  // ✅ Shared internal method
  private async uploadToR2(file: Express.Multer.File, key: string) {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        message: 'Uploaded successfully',
        key,
        url: `${process.env.R2_PUBLIC_URL}/${this.bucket}/${key}`,
      };
    } catch (error) {
      console.error('❌ Upload to R2 failed:', error);
      throw new InternalServerErrorException('Upload failed');
    }
  }

  // ✅ Delete from R2
  async deleteFromR2(key: string) {
    try {
      console.log('bucket', this.bucket, 'key', key);
      const response = await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      console.log('Response', response);

      return {
        message: 'Deleted successfully',
        key,
      };
    } catch (error) {
      throw new InternalServerErrorException('Deletion failed', error);
    }
  }
}
