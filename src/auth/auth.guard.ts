import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { User, UserDocument } from 'src/Api/user/schema/user.schema';
import { Ca, CaDocument } from 'src/Api/ca/schema/ca.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Ca.name) private readonly caModel: Model<CaDocument>,
  ) {}

  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.log('Public route accessed');
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;

    if (!authorization) {
      this.logger.warn('Missing Authorization header');
      throw new UnauthorizedException('Missing token');
    }

    const [, token] = authorization.split(' ');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      this.logger.log(`Token verified. Payload: ${JSON.stringify(payload)}`);

      let user: any = null;

      if (payload.role === 'user') {
        user = await this.userModel.findById(payload.id);
      } else if (payload.role === 'ca') {
        user = await this.caModel.findById(payload.id);
      }

      if (!user) {
        this.logger.warn(`User not found with id: ${payload.id}`);
        throw new UnauthorizedException('Invalid user');
      }

      req.user = user;
      req.userPayload = payload;

      this.logger.log(`Authenticated: ${payload.role} (${user._id})`);
      return true;
    } catch (err) {
      this.logger.error(`JWT validation failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
