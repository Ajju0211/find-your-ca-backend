import { Types } from 'mongoose';
import { CaLoginDto } from '../dto/ca-login.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { Role } from 'src/enum/enum';

export enum PlanType {
  BASIC = 'Basic',
  ADVANCED = 'Advanced',
}

export interface UserInfo {
  _id: Types.ObjectId,
  name: string,
  phone: string
}
export interface SafeAuthUser {
  _id: Types.ObjectId;
  role: 'user' | 'ca' | 'admin';
  phone?: string;
  email?: string;
}

export class SafeUserDto {
  _id: Types.ObjectId;
  user_name: string;
  phone: string;
  role: 'user';
}

export class SafeCaDto {
  _id: Types.ObjectId;
  email: string;
  role: 'ca';
  type: string; // CaFirmType
  form_data: any; // Can be narrowed to IndividualFormDto | ...
  plan_and_expertise: any;
  frn_number?: string;
  cop_number?: string;
  documents?: string[];
  gallery?: string[];
  isApproved?: boolean;
}

export type AuthLoginResponse = {
  access_token: string;
  user: SafeUserDto | SafeCaDto;
};

export interface TokenProps  {
  _id: Types.ObjectId
  role: Role.USER,
  phone: string
}

export type LoginDto = UserLoginDto | CaLoginDto;
