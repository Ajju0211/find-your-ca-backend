import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaController } from './ca.controller';
import { CaService } from './ca.service';
import { Ca, CaSchema } from './schema/ca.schema';
import { MailModule } from 'src/emails/mail.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ca.name, schema: CaSchema }]),
    MailModule,
    CommonModule
  ],
  providers: [CaService],
  controllers: [CaController],
  exports: [MongooseModule],
})
export class CaModule {}
