// src/common/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { EmailController } from './mail.controller';
import { Ca, CaSchema } from 'src/Api/ca/schema/ca.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([{ name: Ca.name, schema: CaSchema }]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class MailModule {}
