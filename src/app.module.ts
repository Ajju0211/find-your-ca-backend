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
import { UserModule } from './Api/user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './emails/mail.module';
import { ReviewsModule } from './Api/reviews/reviews.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // So you don't need to import it in every module
      envFilePath: '.env', // optional, default is .env
    }),
    MongooseModule.forRoot(
      process.env.MONGO_DB_URL ||
        'mongodb+srv://ajaysdoriyal:ajaysdoriyal@cluster0.iz0lg.mongodb.net/llm-blog-data?', // Use environment variable or default
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to the folder
      serveRoot: '/uploads', // URL prefix to serve static files
    }),
    ScheduleModule.forRoot(), // 🆕 Added to enable cron jobs
    BlogModelModule,
    UserModule,
    MailModule,
    CaModule,
    UploadModule,
    ReviewsModule,
    ContactModule,
    TestimonialModule,
    FiltersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
