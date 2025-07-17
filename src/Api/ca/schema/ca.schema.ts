import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CaFirmType, PlanType } from 'src/enum/enum';

export type CaDocument = Ca & Document;

// ====================== ENUMS ======================

// ====================== COMMON FIELDS ======================

@Schema({ _id: false })
class CommonFields {
  @Prop({
    required: true,
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

  @Prop({
    type: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },
    required: true,
  })
  profile_picture: {
    imageUrl: string;
    imageId: string;
  };
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
  sr_partner_name: string;
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
  sr_partner_name: string;
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
  @Prop({ type: PlanAndExpertise })
  plan_and_expertise?: PlanAndExpertise;

  // Step 3: Signup/Login
  @Prop()
  email?: string;

  @Prop({ select: false })
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
  website: string;

  @Prop({ default: false })
  about_us: string;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: [], type: [String] })
  reviews: string[];

  @Prop({ required: true, unique: true })
  tempId: string; // Temporary ID for form progress

  @Prop({ required: true, type: Number, default: 1 })
  form_step_progress: number; // Step progress (1, 2, 3,

  @Prop({ type: [Number], default: [] })
  completed_steps: number[];

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ required: false })
  emailOtp?: string;

  @Prop({ required: false })
  emailOtpExpiresAt?: Date;

  @Prop({ required: false })
  emailOtpRequestedAt?: Date;
}

export const CaSchema = SchemaFactory.createForClass(Ca);

CaSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } },
);

CaSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: 'string' } } },
);
