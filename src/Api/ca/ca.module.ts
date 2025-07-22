import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaController } from './ca.controller';
import { CaService } from './ca.service';
import { Ca, CaSchema } from './schema/ca.schema';
import { MailModule } from 'src/emails/mail.module';
import { CommonModule } from 'src/common/common.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ca.name, schema: CaSchema }]),
    MailModule,
    CommonModule,
    AuthModule,
    UserModule,
  ],
  providers: [CaService, AuthGuard],
  controllers: [CaController],
  exports: [MongooseModule],
})
export class CaModule {}
