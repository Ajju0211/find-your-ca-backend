import { Injectable, Logger } from '@nestjs/common';
import { BlogModelService } from '../blog-model.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BlogCron {
  private readonly logger = new Logger(BlogCron.name);

  constructor(private readonly blogService: BlogModelService) {}

  @Cron('*/10 * * * *') // every 1 min
  async handleBlogCron() {
    this.logger.log('🕒 Running scheduled blog creation json...');
    this.blogService.createAndSaveBlog();
  }
}
