import { Module } from '@nestjs/common';
import { BlogModelController } from './blog-model.controller';
import { BlogModelService } from './blog-model.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogCron } from './jobs/blog.cron';
import { CaModule } from '../ca/ca.module';

@Module({
  imports: [
    CaModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogModelController],
  providers: [BlogModelService, BlogCron],
})
export class BlogModelModule {}
