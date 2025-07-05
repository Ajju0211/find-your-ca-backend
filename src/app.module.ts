import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule'; // 🆕 Added
import { BlogModelModule } from './Api/blog/blog-model.module';
import { CaModule } from './Api/ca/ca.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://ajaysdoriyal:ajaysdoriyal@cluster0.iz0lg.mongodb.net/llm-blog-data?retryWrites=true&w=majority&appName=Cluster0',
    ),
    ScheduleModule.forRoot(), // 🆕 Added to enable cron jobs
    BlogModelModule,
    CaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
