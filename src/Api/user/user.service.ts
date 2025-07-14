import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { LoginDto, TokenProps, UserInfo } from './types/types';
import { JwtService } from '@nestjs/jwt';
import { SafeAuthUser } from './types/types'; // Assuming this is defined in your types
import { MailService } from 'src/emails/mail.service';
import { CaDocument } from '../ca/schema/ca.schema';
import { PasswordService } from 'src/common/service/password.service';
import { CaLoginResponse, LoginResponse, UserLoginResponse } from './types/login-response.type';
import { UserLoginDto } from './dto/user-login.dto';
import { CaLoginDto } from './dto/ca-login.dto';
import { UserModule } from './user.module';
import { CaModelType } from '../ca/types/ca.model.type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Ca') private caModel: Model<CaDocument>,
    private jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailService, // Assuming you have a MailService for sending emails
  ) { }

  generateToken(user: SafeAuthUser): string {
    return this.jwtService.sign(
      {
        sub: user._id,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
      {
        secret: process.env.JWT_SECRET || 'YourSecretKey', // Use a secure secret key
        expiresIn: '7d', // Token expiration time
        algorithm: 'HS256',
      },
    );
  }

  verifyToken(token: string): SafeAuthUser {
    try {
      return this.jwtService.verify(token) as SafeAuthUser;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // ================= SIGNUP =================
  async signup(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      phone: createUserDto.phone,
    });

    if (existingUser) {
      throw new ConflictException('User with this phone already exists');
    }

    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  // ================= LOGIN =================
  /**
   * Login logic for user (via phone) and ca (via email/password)
   */
  async login(body: LoginDto): Promise<LoginResponse> {
    const strategyMap = {
      user: this.loginUser.bind(this),
      ca: this.loginCA.bind(this),
    };

    const strategy = strategyMap[body.role];
    if (!strategy) throw new UnauthorizedException('Invalid login type');

    return strategy(body);
  }

  private async loginUser(body: UserLoginDto): Promise<UserLoginResponse> {
    const user = await this.userModel.findOne({ phone: body.phone }) as UserInfo
    if (!user) throw new UnauthorizedException('User not found');
    const token = this.generateToken({
      _id: user._id as Types.ObjectId,
      role: 'user',
      phone: user.phone,
    });

    return { token, user }; // shape according to UserLoginResponse
  }

  private async loginCA(body: CaLoginDto): Promise<CaLoginResponse> {
    const user = await this.caModel.findOne({ email: body.email }).select('+password') as CaModelType
      if(!user) throw new UnauthorizedException('CA not found');

    const isMatch = await this.passwordService.verify(user.password as string, body.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const token = this.generateToken({
      _id: user._id as Types.ObjectId,
      role: 'ca',
      phone: user.form_data.phone,
    });

    return { token, user };
  }

}
