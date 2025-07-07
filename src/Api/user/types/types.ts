import { CaLoginDto } from '../dto/ca-login.dto';
import { UserLoginDto } from '../dto/user-login.dto';

export enum PlanType {
  BASIC = 'Basic',
  ADVANCED = 'Advanced',
}

export interface SafeAuthUser {
  _id: string;
  role: 'user' | 'ca' | 'admin';
  phone?: string;
  email?: string;
}

export class SafeUserDto {
  _id: string;
  user_name: string;
  phone: string;
  role: 'user';
}

export class SafeCaDto {
  _id: string;
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

export type LoginDto = UserLoginDto | CaLoginDto;
