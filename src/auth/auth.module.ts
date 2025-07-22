import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from 'src/Api/user/user.module';
import { RolesGuard } from '../permissions/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Ca, CaSchema } from 'src/Api/ca/schema/ca.schema';
import { User, UserSchema } from 'src/Api/user/schema/user.schema';
import { AuthGuard } from './auth.guard';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Ca.name, schema: CaSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a secure secret key
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, AuthGuard],
  exports: [
    AuthService,
    JwtModule, // ✅ this is the missing piece
  ],
})
export class AuthModule {}
