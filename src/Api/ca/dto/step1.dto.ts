// step1.dto.ts
import { IsArray, IsEmpty, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CaFirmType } from 'src/enum/enum';
import {
  IndividualFormDto,
  PartnershipFormDto,
  AdvisoryFormDto,
  LlpFormDto,
} from './create-ca.dto';

export class Step1Dto {
  @IsEnum(CaFirmType)
  type: CaFirmType;

  @ValidateNested()
  form_data:
    | IndividualFormDto
    | PartnershipFormDto
    | AdvisoryFormDto
    | LlpFormDto;

  @IsString()
  tempId: string;

  @IsNumber()
  form_step_progress: number;

  @IsArray()
  completed_steps: number[]
}
