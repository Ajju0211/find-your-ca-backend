import {
  IndividualFormDto,
  PartnershipFormDto,
  AdvisoryFormDto,
  LlpFormDto,
} from 'src/Api/ca/dto/create-ca.dto';
import {
  UpdateAdvisoryFormDto,
  UpdateIndividualFormDto,
  UpdateLlpFormDto,
  UpdatePartnershipFormDto,
} from 'src/Api/ca/dto/update-ca.dto';
import { CaFirmType } from 'src/enum/enum';

export function getFormDtoClass(type: CaFirmType): any {
  switch (type) {
    case CaFirmType.INDIVIDUAL:
      return IndividualFormDto;
    case CaFirmType.PARTNERSHIP:
      return PartnershipFormDto;
    case CaFirmType.ADVISORY:
      return AdvisoryFormDto;
    case CaFirmType.LLP:
      return LlpFormDto;
    default:
      throw new Error('Invalid firm type');
  }
}

export function getUpdatedFormDtoClass(type: CaFirmType): any {
  switch (type) {
    case CaFirmType.INDIVIDUAL:
      return UpdateIndividualFormDto;
    case CaFirmType.PARTNERSHIP:
      return UpdatePartnershipFormDto;
    case CaFirmType.ADVISORY:
      return UpdateAdvisoryFormDto;
    case CaFirmType.LLP:
      return UpdateLlpFormDto;
    default:
      throw new Error('Invalid firm type');
  }
}
