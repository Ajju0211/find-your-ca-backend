// ca-login-response.type.ts
import { Types } from 'mongoose';
import { CaFirmType, PlanType } from 'src/enum/enum';

// ====================== COMMON FIELDS ======================
interface CommonFields {
  phone: string;
  alternative_phone?: string;
  main_address: string;
  alternative_address?: string;
  city: string;
  pincode: string;
  profile_picture: string;
}

// ====================== FORM TYPES ======================
interface IndividualForm extends CommonFields {
  first_name: string;
  last_name: string;
  firm_name: string;
}

interface PartnershipForm extends CommonFields {
  firm_name: string;
  partner_name: string;
}

interface AdvisoryForm extends CommonFields {
  advisory_name: string;
  incharge?: string;
}

interface LlpForm extends CommonFields {
  firm_name: string;
  partner_name: string;
}

type CaFormData =
  | IndividualForm
  | PartnershipForm
  | AdvisoryForm
  | LlpForm;

// ====================== PLAN & EXPERTISE ======================
interface PlanAndExpertise {
  plan_type: PlanType;
  price: number;
  features: string[];
  industry: string;
  basic_services: string[];
  advanced_services?: string[];
}

// ====================== FINAL LOGIN RESPONSE ======================
export interface CaLoginResponse {
  token: string;
  user: {
    _id: Types.ObjectId;
    type: CaFirmType;
    email?: string;
    role: string;
    frn_number?: string;
    cop_number?: string;
    website?: string;
    about_us?: string;
    isApproved?: boolean;
    documents?: string[];
    gallery?: string[];
    form_data: CaFormData;
    plan_and_expertise?: PlanAndExpertise;
    form_step_progress: number;
    completed_steps: number[];
  };
}


// types/ca-verified-response.type.ts
export interface VerifiedCA {
  _id: Types.ObjectId ;
  form_data?: {
    firm_name?: string;
    phone?: string;
  };
  plan_and_expertise?: {
    industry?: string[];
    basic_services?: string[];
    advanced_services?: string[];
  };
}


export interface StepResponse {
  success: boolean;
  message: string;
  form_step_progress: number;
  completed_steps?: number[];
  tempId?: string;
}



// New filtered CA result interface
export interface FilteredCaResult {
  form_data: {
    firm_name?: string;
    phone?: string;
  };
  plan_and_expertise: {
    industry: string;
    basic_services: string[];
    advanced_services?: string[];
  };
}

export interface SanitizedCa {
  _id: Types.ObjectId;
  email: string;
  type: string;
  form_data: Record<string, any>;
  plan_and_expertise: Record<string, any>;
  frn_number?: string;
  cop_number?: string;
  documents?: string[];
  gallery?: string[];
  role: string;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

