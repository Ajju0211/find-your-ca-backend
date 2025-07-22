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
import { LoginDto, UserInfo } from './types/types';
import { JwtService } from '@nestjs/jwt';
import { SafeAuthUser } from './types/types'; // Assuming this is defined in your types
import { CaDocument } from '../ca/schema/ca.schema';
import { PasswordService } from 'src/common/service/password.service';
import {
  CaLoginResponse,
  LoginResponse,
  UserLoginResponse,
} from './types/login-response.type';
import { UserLoginDto } from './dto/user-login.dto';
import { CaLoginDto } from './dto/ca-login.dto';

import { CaModelType } from '../ca/types/ca.model.type';
import { CaLoginOtpDto } from './dto/ca-login-otp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Ca') private caModel: Model<CaDocument>,
    private jwtService: JwtService,
    private readonly passwordService: PasswordService,
    // Assuming you have a MailService for sending emails
  ) {}

  generateToken(user: SafeAuthUser): string {
    return this.jwtService.sign(
      {
        id: user._id,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
      {
        secret: process.env.JWT_SECRET, // Use a secure secret key
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
    const user = (await this.userModel.findOne({
      phone: body.phone,
    })) as UserInfo;
    if (!user) throw new UnauthorizedException('User not found');
    const token = this.generateToken({
      _id: user._id as Types.ObjectId,
      role: 'user',
      phone: user.phone,
    });

    return { token, user }; // shape according to UserLoginResponse
  }

  private async loginCA(body: CaLoginDto): Promise<UserLoginResponse> {
    const user = await this.caModel
      .findOne({ email: body.email })
      .select('+password')
      .lean();

    if (!user) throw new UnauthorizedException('CA not found');

    // const responseData = (await this.caModel.findOne({
    //   email: body.email,
    // })) as CaModelType;

    const isMatch = await this.passwordService.verify(
      user.password as string,
      body.password,
    );

    const { password, ...userWithoutPassword } = user.toObject
      ? user.toObject()
      : user;
    if (user)
      if (!isMatch)
        // const response = userWithoutPassword as CaModelType
        throw new UnauthorizedException('Invalid email or password');

    const token = this.generateToken({
      _id: user._id as Types.ObjectId,
      role: 'ca',
      phone: user.form_data.phone,
    });

    return { token, user: userWithoutPassword };
  }

  // Add this inside the class
  async loginCAWithOtp(body: CaLoginOtpDto): Promise<CaLoginResponse> {
    const ca = (await this.caModel.findOne({
      'form_data.phone': body.phone,
    })) as CaModelType;
    if (!ca) throw new UnauthorizedException('CA not found');

    // Replace this with your actual OTP verification logic
    const isOtpValid = body.otp === '123456'; // Example OTP check
    if (!isOtpValid) throw new UnauthorizedException('Invalid OTP');

    const token = this.generateToken({
      _id: ca._id as Types.ObjectId,
      role: 'ca',
      phone: ca.form_data.phone,
    });

    return { token, user: ca };
  }
}
