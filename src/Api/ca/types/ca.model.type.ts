// ca.model.type.ts
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
export interface IndividualForm extends CommonFields {
  first_name: string;
  last_name: string;
  firm_name: string;
}

export interface PartnershipForm extends CommonFields {
  firm_name: string;
  partner_name: string;
}

export interface AdvisoryForm extends CommonFields {
  advisory_name: string;
  incharge?: string;
}

export interface LlpForm extends CommonFields {
  firm_name: string;
  partner_name: string;
}

export type CaFormData =
  | IndividualForm
  | PartnershipForm
  | AdvisoryForm
  | LlpForm;

// ====================== PLAN & EXPERTISE ======================
export interface PlanAndExpertise {
  plan_type: PlanType;
  price: number;
  features: string[];
  industry: string;
  basic_services: string[];
  advanced_services?: string[];
}

// ====================== MAIN CA TYPE ======================
export interface CaModelType {
  _id: Types.ObjectId;
  type: CaFirmType;
  form_data: CaFormData;
  plan_and_expertise?: PlanAndExpertise;
  email?: string;
  password?: string;
  frn_number?: string;
  cop_number?: string;
  documents?: string[];
  gallery?: string[];
  role: string;
  website?: string;
  about_us?: string;
  isApproved?: boolean;
  reviews?: string[];
  tempId: string;
  form_step_progress: number;
  completed_steps: number[];
  createdAt?: Date;
  updatedAt?: Date;
}
