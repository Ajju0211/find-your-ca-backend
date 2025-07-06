import toStream = require('buffer-to-stream');
import { v2 as cloudinary } from 'cloudinary';
import { BadRequestException } from '@nestjs/common';

// Setup cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryUpload {
  /**
   * Upload single profile image
   */
  static async uploadProfile(file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException('Profile image is required');
    const result = await this.uploadToCloudinary(file, 'ca/profile');
    return result.secure_url;
  }

  /**
   * Upload multiple gallery images
   */
  static async uploadGallery(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];
    const uploads = await Promise.all(
      files.map((file) => this.uploadToCloudinary(file, 'ca/gallery'))
    );
    return uploads.map((res) => res.secure_url);
  }

  /**
   * Upload 2 documents (PDF/Image)
   */
  static async uploadDocuments(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length !== 2) {
      throw new BadRequestException('Exactly 2 documents are required');
    }
    const uploads = await Promise.all(
      files.map((file) => this.uploadToCloudinary(file, 'ca/documents'))
    );
    return uploads.map((res) => res.secure_url);
  }

  /**
   * Core upload logic
   */
  private static uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}
