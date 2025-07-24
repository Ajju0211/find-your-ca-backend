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
import { ImageDto } from './create-ca.dto';

// ====================== COMMON FIELDS DTO ======================

class UploadedFileMeta {
  url: string;
  key: string;
  name: string;
  size: number;
  mimeType: string;
  extension: string;
}

class UpdateCommonFieldsDto {
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/)
  phone?: string;

  @IsOptional()
  @IsString()
  alternative_phone?: string;

  @IsOptional()
  @IsString()
  main_address?: string;

  @IsOptional()
  @IsString()
  alternative_address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}

// ====================== FORM TYPES DTO ======================

export class UpdateIndividualFormDto extends UpdateCommonFieldsDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  firm_name?: string;
}

export class UpdatePartnershipFormDto extends UpdateCommonFieldsDto {
  @IsOptional()
  @IsString()
  firm_name?: string;

  @IsOptional()
  @IsString()
  partner_name?: string;
}

export class UpdateAdvisoryFormDto extends UpdateCommonFieldsDto {
  @IsOptional()
  @IsString()
  advisory_name?: string;

  @IsOptional()
  @IsString()
  incharge?: string;
}

export class UpdateLlpFormDto extends UpdateCommonFieldsDto {
  @IsOptional()
  @IsString()
  firm_name?: string;

  @IsOptional()
  @IsString()
  partner_name?: string;
}

// ====================== PLAN & EXPERTISE DTO ======================

export class UpdatePlanAndExpertiseDto {
  @IsOptional()
  @IsEnum(PlanType)
  plan_type?: PlanType;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  industry?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  basic_services?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  advanced_services?: string[];
}

// ====================== UPDATE CA DTO ======================

export class UpdateCaDto {
  @IsOptional()
  @IsEnum(CaFirmType)
  type?: CaFirmType;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  form_data?:
    | UpdateIndividualFormDto
    | UpdatePartnershipFormDto
    | UpdateAdvisoryFormDto
    | UpdateLlpFormDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePlanAndExpertiseDto)
  plan_and_expertise?: UpdatePlanAndExpertiseDto;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  frn_number?: string;

  @IsOptional()
  @IsString()
  cop_number?: string;

  @IsOptional()
  @IsArray()
  documents?: UploadedFileMeta[];

  @IsOptional()
  @IsArray()
  gallery?: ImageDto[];

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  @IsString()
  tempId: string;

  // ✅ NEW: Step progress (1, 2, 3, etc.)
  @IsOptional()
  @IsNumber()
  form_step_progress: number;
}
