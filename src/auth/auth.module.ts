import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from 'src/Api/user/user.module';
import { RolesGuard } from '../permissions/roles.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'YourSecretKey', // Use a secure secret key
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [
    AuthService,
    JwtModule, // ✅ this is the missing piece
  ],
})
export class AuthModule {}
