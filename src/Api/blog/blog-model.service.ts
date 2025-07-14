import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generateBlogFromLLM } from './llm/llm.model';
import { Ca } from '../ca/schema/ca.schema';
import { BlogType } from './interface/blog.interface';

@Injectable()
export class BlogModelService {
  constructor(
    @InjectModel(Ca.name) private caModel: Model<Ca>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}
// blog.service.ts
async getBlogs(limit = 12, skip = 0): Promise<BlogType[]> {
  return this.blogModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec() as any;
}


  // Get Blog By Id
  async getBlogsById(id: string): Promise<Blog> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid blog ID');
    }

    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  }
  /**
   * Generate the Blog using LLM
   * Save the blog after validate
   */

  async createAndSaveBlog(): Promise<Blog> {
    const data = await this.getTop5CABySpecialty('NRI Filing');

    //Atemp 1
    let blog = await generateBlogFromLLM(data);
    if (this.validateBlogStructure(blog)) {
      const cleanedJsonBlogObject = {
        ...blog,
        dateCreated: new Date(blog.dateCreated), // convert to object data
      };
      const saved = await this.blogModel.create(cleanedJsonBlogObject);

      return saved;
    }

    //Atemp 2
    blog = await generateBlogFromLLM(data);
    if (this.validateBlogStructure(blog)) {
      const cleanedJsonBlogObject = {
        ...blog,
        dateCreated: new Date(blog.dateCreated), // convert to object data
      };
      const saved = await this.blogModel.create(cleanedJsonBlogObject);

      return saved;
    }
    //Atemp 3
    blog = await generateBlogFromLLM(data);
    if (this.validateBlogStructure(blog)) {
      const cleanedJsonBlogObject = {
        ...blog,
        dateCreated: new Date(blog.dateCreated), // convert to object data
      };
      const saved = await this.blogModel.create(cleanedJsonBlogObject);

      return saved;
    }
    console.log('Blog is not created');

    return blog;
  }
  /**
   *  Validate the sctructure of the blog
   */
  private validateBlogStructure(blog: any): boolean {
    if (
      !blog ||
      typeof blog !== 'object' ||
      typeof blog.dateCreated !== 'string' ||
      !Array.isArray(blog.experts) ||
      blog.experts.length === 0
    ) {
      return false;
    }
    for (const expert of blog.experts) {
      const hasRequiredFields =
        typeof expert.name === 'string' &&
        typeof expert.description === 'string' &&
        typeof expert.rating === 'number';

      if (!hasRequiredFields) return false;

      // Validate buttons if present (optional field)
      if (expert.buttons) {
        const buttonsAreValid =
          typeof expert.buttons === 'object' &&
          (expert.buttons.profile === undefined ||
            typeof expert.buttons.profile === 'string') &&
          (expert.buttons.contact === undefined ||
            typeof expert.buttons.contact === 'string');

        if (!buttonsAreValid) return false;
      }
    }

    return true;
  }

  /**
   * Get the Ca based on speciality
   */
  async getTop5CABySpecialty(specialty: string) {
    return this.caModel
      .find({ specialties: specialty })
      .limit(5)
      .sort({ rating: -1 });
  }
}
