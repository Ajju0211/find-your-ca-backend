import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule'; // 🆕 Added
import { BlogModelModule } from './Api/blog/blog-model.module';
import { CaModule } from './Api/ca/ca.module';
import { ContactModule } from './Api/contact-us/contact.module';
import { TestimonialModule } from './Api/testimonial/testimonial.module';
import { FiltersModule } from './Api/filters/filters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // So you don't need to import it in every module
      envFilePath: '.env', // optional, default is .env
    }),
    MongooseModule.forRoot(
      'mongodb+srv://ajaysdoriyal:ajaysdoriyal@cluster0.iz0lg.mongodb.net/llm-blog-data?retryWrites=true&w=majority&appName=Cluster0',
    ),
    ScheduleModule.forRoot(), // 🆕 Added to enable cron jobs
    BlogModelModule,
    CaModule,
    ContactModule,
    TestimonialModule,
    FiltersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
