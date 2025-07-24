// step1.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CaFirmType } from 'src/enum/enum';
import { getFormDtoClass } from 'src/utils/form-type-mapper';
import {
  AdvisoryFormDto,
  IndividualFormDto,
  LlpFormDto,
  PartnershipFormDto,
} from './create-ca.dto';

export class Step1Dto {
  @IsEnum(CaFirmType)
  type: CaFirmType;

  @ValidateNested()
  @Type((obj) => getFormDtoClass(obj?.object?.type)) // you already wrote this helper
  form_data:
    | IndividualFormDto
    | PartnershipFormDto
    | AdvisoryFormDto
    | LlpFormDto;

  @IsOptional()
  @IsString()
  tempId: string;

  @IsNumber()
  form_step_progress: number;

  @IsArray()
  completed_steps: number[];
}
