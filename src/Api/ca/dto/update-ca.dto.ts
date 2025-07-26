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
import { CommonFieldsDto, ImageDto } from './create-ca.dto';
import { getUpdatedFormDtoClass } from 'src/utils/form-type-mapper';
import { PartialType } from '@nestjs/swagger';

// ====================== COMMON FIELDS DTO ======================

class UploadedFileMeta {
  url: string;
  key: string;
  name: string;
  size: number;
  mimeType: string;
  extension: string;
}

export class UpdateCommonFieldsDto extends PartialType(CommonFieldsDto) {}
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
  @Type((obj) => getUpdatedFormDtoClass(obj?.object?.type)) // you already wrote this helper
  form_data:
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
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
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

  @IsOptional()
  @IsString()
  website?: string;
  // ✅ NEW: Step progress (1, 2, 3, etc.)
  @IsOptional()
  @IsNumber()
  form_step_progress: number;

  @IsOptional()
  @IsString()
  about_us?: string;
}
