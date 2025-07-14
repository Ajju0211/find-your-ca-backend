// step1.dto.ts
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { CaFirmType } from 'src/enum/enum';

export class Step1Dto {
  @IsEnum(CaFirmType)
  type: CaFirmType;

  form_data: any; // We will validate manually in the controller

  @IsString()
  tempId: string;

  @IsNumber()
  form_step_progress: number;

  @IsArray()
  completed_steps: number[];
}
