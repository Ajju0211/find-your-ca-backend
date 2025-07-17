import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CaFirmType, PlanType } from 'src/enum/enum';

// ====================== COMMON FIELDS DTO ======================


class ImageDto {
  @IsString()
  imageUrl: string;

  @IsString()
  imageId: string;
}
class CommonFieldsDto {
  @IsString()
  @Matches(/^[0-9]{10}$/)
  phone: string;

  @IsOptional()
  @IsString()
  alternative_phone?: string;

  @IsString()
  main_address: string;

  @IsOptional()
  @IsString()
  alternative_address?: string;

  @IsString()
  pincode: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  location: string;

  @ValidateNested()
  @Type(() => ImageDto)
  profile_picture: ImageDto;
}

// ====================== FORM TYPES DTO ======================

export class IndividualFormDto extends CommonFieldsDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  firm_name: string;
}

export class PartnershipFormDto extends CommonFieldsDto {
  @IsString()
  firm_name: string;

  @IsString()
  sr_partner_name: string;
}

export class AdvisoryFormDto extends CommonFieldsDto {
  @IsString()
  advisory_name: string;

  @IsOptional()
  @IsString()
  incharge: string;
}

export class LlpFormDto extends CommonFieldsDto {
  @IsString()
  firm_name: string;

  @IsString()
  sr_partner_name: string;
}

// ====================== PLAN & EXPERTISE DTO ======================

export class PlanAndExpertiseDto {
  @IsEnum(PlanType)
  plan_type: PlanType;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsString()
  industry: string;

  @IsArray()
  @IsString({ each: true })
  basic_services: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  advanced_services?: string[];
}

// ====================== CREATE CA DTO ======================

export class CreateCaDto {
  @IsEnum(CaFirmType)
  type: CaFirmType;

  @ValidateNested()
  @Type(() => Object)
  form_data:
    | IndividualFormDto
    | PartnershipFormDto
    | AdvisoryFormDto
    | LlpFormDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanAndExpertiseDto)
  plan_and_expertise: PlanAndExpertiseDto;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  frn_number?: string;

  @IsOptional()
  @IsString()
  cop_number?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  about_us?: string;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  @IsArray()
  reviews?: string[];

  @IsString()
  tempId: string;

  // ✅ NEW: Step progress (1, 2, 3, etc.)
  @IsNumber()
  form_step_progress: number;

  @IsOptional()
  @IsArray()
  completed_steps: number[];
}
