// ==========================
// Final CA Login Response

import { Types } from 'mongoose';
import { CaModelType } from 'src/Api/ca/types/ca.model.type';

// ==========================
export interface CaLoginResponse {
  token: string;
  user: CaModelType;
}

//User login response

export interface UserLoginResponse {
  token: string;
  user: {
    _id: Types.ObjectId;
    name: string;
    phone: string;
  };
}

export type LoginResponse = CaLoginResponse | UserLoginResponse;
