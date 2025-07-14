// validate-form-data.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  AdvisoryFormDto,
  IndividualFormDto,
  LlpFormDto,
  PartnershipFormDto,
} from '../ca/dto/create-ca.dto';
import { BadRequestException } from '@nestjs/common';
import { CaFirmType } from 'src/enum/enum';

export async function validateFormDataByType(type: CaFirmType, form_data: any) {
  let dtoClass;

  switch (type) {
    case CaFirmType.INDIVIDUAL:
      dtoClass = IndividualFormDto;
      break;
    case CaFirmType.PARTNERSHIP:
      dtoClass = PartnershipFormDto;
      break;
    case CaFirmType.ADVISORY:
      dtoClass = AdvisoryFormDto;
      break;
    case CaFirmType.LLP:
      dtoClass = LlpFormDto;
      break;
    default:
      throw new BadRequestException('Invalid firm type');
  }

  const dtoInstance = plainToInstance(dtoClass, form_data);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }

  return dtoInstance; // Validated and transformed
}
