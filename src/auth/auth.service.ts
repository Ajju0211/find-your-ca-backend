import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface SafeAuthUser {
  _id: string;
  role: 'user' | 'ca' | 'admin'; // extend if needed
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: SafeAuthUser): string {
    return this.jwtService.sign({
      sub: user._id,
      role: user.role,
      phone: user.phone,
    });
  }

  verifyToken(token: string): SafeAuthUser {
    try {
      return this.jwtService.verify(token) as SafeAuthUser;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
