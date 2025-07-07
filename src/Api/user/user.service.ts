import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { LoginDto } from './types/types';
import { JwtService } from '@nestjs/jwt';
import { SafeAuthUser } from './types/types'; // Assuming this is defined in your types
import { MailService } from 'src/emails/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Ca') private caModel: Model<any>,
    private jwtService: JwtService,
    private readonly mailService: MailService, // Assuming you have a MailService for sending emails
  ) {}

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
  async login(body: LoginDto): Promise<any> {
    if (body.role === 'user') {
      const user = await this.userModel.findOne({ phone: body.phone });

      if (!user) throw new UnauthorizedException('User not found');

      const token = this.generateToken({
        _id: user._id,
        role: 'user',
        phone: user.phone,
      } as any);

      const safeUser = {
        _id: user._id,
        user_name: user?.name,
        phone: user.phone,
        role: 'user',
      };

      return { token, user: safeUser };
    }

    if (body.role === 'ca') {
      const ca = await this.caModel
        .findOne({ email: body.email })
        .select('+password');
      console.log('CA found:', ca);

      if (!ca) throw new UnauthorizedException('CA not found');

      // 🔐 Securely compare hashed password

      const isMatch = await bcrypt.compare(body.password, ca.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.generateToken({
        _id: ca._id,
        role: 'ca',
        phone: ca.form_data?.phone,
      });

      const safeCa = {
        _id: ca._id,
        email: ca.email,
        role: 'ca',
        type: ca.type,
        form_data: ca.form_data,
        plan_and_expertise: ca.plan_and_expertise,
        frn_number: ca.frn_number,
        cop_number: ca.cop_number,
        documents: ca.documents,
        gallery: ca.gallery,
        isApproved: ca.isApproved,
      };

      await this.mailService.sendMail({
        to: 'ajaysdoriyal@gmail.com',
        subject: 'Welcome!',
        text: 'Thanks for signing up.',
        html: '<h1>Thanks for signing up</h1>',
      });

      return { token, user: safeCa };
    }

    throw new UnauthorizedException('Invalid login type');
  }
}
