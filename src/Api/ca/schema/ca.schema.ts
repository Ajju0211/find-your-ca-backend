import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CaDocument = Ca & Document;

// ====================== ENUMS ======================

export enum CaFirmType {
  INDIVIDUAL = 'individual',
  LLP = 'llp',
  PARTNERSHIP = 'partnership',
  ADVISORY = 'advisory',
}

export enum PlanType {
  BASIC = 'basic',
  ADVANCE = 'advance',
}

// ====================== COMMON FIELDS ======================

@Schema({ _id: false })
class CommonFields {
  @Prop({
    required: true,
    unique: true,
    match: /^[0-9]{10}$/, // Valid 10-digit number
  })
  phone: string;

  @Prop()
  alternative_phone?: string;

  @Prop({ required: true })
  main_address: string;

  @Prop()
  alternative_address?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ required: true })
  profile_picture: string; // File URL or base64 path
}

// ====================== FORM TYPES ======================

@Schema({ _id: false })
class IndividualForm extends CommonFields {

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

   @Prop({ required: true })
  firm_name: string;
}

@Schema({ _id: false })
class PartnershipForm extends CommonFields {
  @Prop({ required: true })
  firm_name: string;

  @Prop({ required: true })
  partner_name: string;
}

@Schema({ _id: false })
class AdvisoryForm extends CommonFields {
  @Prop({ required: true })
  advisory_name: string;

  @Prop()
  incharge?: string;
}

@Schema({ _id: false })
class LlpForm extends CommonFields {
  @Prop({ required: true })
  firm_name: string;

  @Prop({ required: true })
  partner_name: string;
}

// ====================== PLAN & EXPERTISE ======================

@Schema({ _id: false })
class PlanAndExpertise {
  @Prop({ required: true, enum: PlanType })
  plan_type: PlanType;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop({ required: true })
  industry: string;

  @Prop({ type: [String], required: true })
  basic_services: string[];

  @Prop({ type: [String], default: [] })
  advanced_services?: string[];
}

// ====================== MAIN CA SCHEMA ======================

@Schema({ timestamps: true })
export class Ca {
  // Step 1: Plan & Services
  @Prop({ required: true, enum: CaFirmType })
  type: CaFirmType;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  form_data: IndividualForm | PartnershipForm | AdvisoryForm | LlpForm;

  // Step 2: Form
  @Prop({ type: PlanAndExpertise, required: true })
  plan_and_expertise: PlanAndExpertise;

  // Step 3: Signup/Login
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false})
  password: string;

   // After sign-up Fields (Place them here)
  @Prop()
  frn_number?: string;

  @Prop()
  cop_number?: string;

  @Prop({ type: [String], default: [] })
  documents?: string[];

  @Prop({ type: [String], default: [] })
  gallery?: string[];

  // Optional: Roles / Status
  @Prop({ default: 'ca' })
  role: string;

  @Prop({ default: false })
  isApproved: boolean;
}

export const CaSchema = SchemaFactory.createForClass(Ca);
