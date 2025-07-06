import {
  IndividualFormDto,
  PartnershipFormDto,
  AdvisoryFormDto,
  LlpFormDto,
} from 'src/Api/ca/dto/create-ca.dto';
import { CaFirmType } from '../ca/schema/ca.schema';



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
