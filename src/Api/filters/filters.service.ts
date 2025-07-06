import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ca, CaDocument } from 'src/Api/ca/schema/ca.schema';
import { Model } from 'mongoose';

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(Ca.name) private readonly caModel: Model<CaDocument>,
  ) {}

  async getFilters() {
    const firmTypes = await this.caModel.distinct('type');
    const industries = await this.caModel.distinct('plan_and_expertise.industry');
    const basicServices = await this.caModel.distinct('plan_and_expertise.basic_services');
    const advancedServices = await this.caModel.distinct('plan_and_expertise.advanced_services');
    const cities = await this.caModel.distinct('form_data.city');
    const plans = await this.caModel.distinct('plan_and_expertise.plan_type');

    return {
      firmTypes,
      industries,
      services: Array.from(new Set([
        ...(basicServices || []),
        ...(advancedServices || [])
      ].filter(Boolean))),
      cities,
      plans,
    };
  }
}
