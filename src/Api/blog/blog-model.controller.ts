import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogModelService } from './blog-model.service';
import { Blog } from './schemas/blog.schema';

@Controller('blogs')
export class BlogModelController {
  constructor(private readonly blogService: BlogModelService) {}

  // blog.controller.ts
@Get('all')
async getBlogs(
  @Query('limit') limit: string,
  @Query('skip') skip: string,
) {
  const blogs = await this.blogService.getBlogs(
    Number(limit) || 12,
    Number(skip) || 0,
  );
  return blogs;
}


  @Get(':id')
  async getBlogById(@Param('id') id: string): Promise<Blog> {
    return await this.blogService.getBlogsById(id);
  }
}
