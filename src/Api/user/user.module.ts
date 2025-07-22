import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';
import { Ca, CaSchema } from '../ca/schema/ca.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/emails/mail.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Ca.name, schema: CaSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // Token expiration time
    }),
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule], // optional: export if other modules need it
})
export class UserModule {}
