import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // ================= SIGNUP =================
  async signup(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ phone: createUserDto.phone });

    if (existingUser) {
      throw new ConflictException('User with this phone already exists');
    }

    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  // ================= LOGIN =================
  async login(phone: string): Promise<User> {
    const user = await this.userModel.findOne({ phone });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user; // You can return token or session later
  }
}
