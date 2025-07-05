import { Controller, Get, Param } from '@nestjs/common';
import { BlogModelService } from './blog-model.service';

@Controller('blogs')
export class BlogModelController {
  constructor(private readonly blogService: BlogModelService) {}

  @Get()
  async getBlogs(): Promise<any> {
    const res = await this.blogService.getBlogs();
    return res;
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string): Promise<any> {
    const res = await this.blogService.getBlogsById(id);
    return res;
  }
}
