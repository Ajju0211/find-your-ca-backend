import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlanType } from 'src/enum/enum';

// 🔹 DTO for Plan Details (Only for Step 2)
export class Step2PlanDto {
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

// 🔹 Step 2 DTO (Used in PATCH or POST to update step 2)
export class Step2Dto {
  @ValidateNested()
  @Type(() => Step2PlanDto)
  plan_and_expertise: Step2PlanDto;

  @IsOptional()
  @IsString()
  tempId: string;

  @IsNumber()
  form_step_progress: number;

  @IsOptional()
  @IsArray()
  completed_steps?: number[];
}
