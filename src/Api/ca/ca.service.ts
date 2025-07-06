import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ca, CaDocument } from './schema/ca.schema';
import { Model } from 'mongoose';
import { CreateCaDto } from './dto/create-ca.dto';
import { UpdateCaDto } from './dto/update-ca.dto';
import { Roles } from 'src/permissions/roles.decorator';
@Injectable()
export class CaService {
  constructor(@InjectModel(Ca.name) private readonly caModel: Model<CaDocument>) { }

  /**
   * Create a new CA Firm
   */
  async signUp(createCaDto: CreateCaDto): Promise<Ca> {
    // Check for existing email
    const emailExists = await this.findByEmail(createCaDto.email);
    if (emailExists) {
      throw new BadRequestException('Email already registered');
    }

    // Check for existing phone number
    const phoneExists = await this.findByPhone(createCaDto.form_data.phone);
    if (phoneExists) {
      throw new BadRequestException('Phone number already in use');
    }

    const newCa = new this.caModel(createCaDto);
    return await newCa.save();
  }

  /**
 * Update CA firm details
 */
  async update(id: string, updateCaDto: UpdateCaDto): Promise<Partial<Ca>> {
    const ca = await this.caModel.findById(id);
    if (!ca) {
      throw new NotFoundException(`CA firm with id ${id} not found`);
    }

    // Optional: prevent updating email/phone to one that already exists
    if (updateCaDto.email && updateCaDto.email !== ca.email) {
      const emailExists = await this.findByEmail(updateCaDto.email);
      if (emailExists) throw new BadRequestException('Email already taken');
    }

    if (
      updateCaDto.form_data?.phone &&
      updateCaDto.form_data.phone !== ca.form_data.phone
    ) {
      const phoneExists = await this.findByPhone(updateCaDto.form_data.phone);
      if (phoneExists) throw new BadRequestException('Phone already in use');
    }

    // Perform update
    await this.caModel.updateOne({ _id: id }, { $set: updateCaDto });

    // Get updated CA without password
    const updatedCa = await this.caModel.findById(id).lean<Ca>();
    if (!updatedCa) {
      throw new NotFoundException(`CA firm with id ${id} not found after update`);
    }

    const { password, ...sanitized } = updatedCa as any;
    return sanitized;
  }


  /**
   * Get all CA Firms - sorted by most recent
   */
  async findAll(): Promise<Ca[]> {
    return this.caModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * Find all Verified Firms - sorted by most recent
   */
  async findVerified(): Promise<any> {
  return this.caModel
    .find({ isApproved: true })
    .sort({ createdAt: -1 })
    .select({
      _id: 1,
      'form_data.firm_name': 1,
      'form_data.phone': 1,
      'plan_and_expertise.industry': 1,
      'plan_and_expertise.basic_services': 1,
      'plan_and_expertise.advanced_services': 1,
    })
    .lean()
    .exec();
}



  /**
   * Get a CA Firm by ID
   */
  async findOne(id: string): Promise<Ca> {
    const ca = await this.caModel.findById(id).exec();
    if (!ca) {
      throw new NotFoundException(`CA firm with id ${id} not found`);
    }
    return ca;
  }

  /**
 * Filter CA firms based on query parameters like service, location, industry, firm type, etc.
 * Example: /ca/filter?city=Mumbai&industry=Finance&type=individual
 */
  async filterCAs(query: any): Promise<any[]> {
    const filter: any = {};

    if (query.services) {
      filter.$or = [
        { 'plan_and_expertise.basic_services': { $in: [].concat(query.services) } },
        { 'plan_and_expertise.advanced_services': { $in: [].concat(query.services) } },
      ];
    }

    if (query.location) {
      filter['form_data.city'] = query.location;
    }

    if (query.industry) {
      filter['plan_and_expertise.industry'] = query.industry;
    }

    if (query.firm_size) {
      if (query.firm_size === 'small') filter['type'] = 'individual';
      else if (query.firm_size === 'medium') filter['type'] = 'partnership';
      else if (query.firm_size === 'large') filter['type'] = 'llp';
    }

    return this.caModel
      .find(filter)
      .select({
        'form_data.firm_name': 1,
        'plan_and_expertise.industry': 1,
        'plan_and_expertise.basic_services': 1,
        'plan_and_expertise.advanced_services': 1,
        'form_data.phone': 1,
        _id: 1,
      })
      .exec();
  }

  /**
   * Delete a CA Firm by ID
   */
  @Roles('ca')
  async deleteCaById(id: string): Promise<{ deleted: boolean }> {
    const res = await this.caModel.deleteOne({ _id: id }).exec();
    return { deleted: res.deletedCount > 0 };
  }

  /**
   * Find by email (used in signup/login)
   */
  async findByEmail(email: string): Promise<Ca | null> {
    return this.caModel.findOne({ email }).exec();
  }

  /**
   * Find by phone inside form_data (used in signup)
   */
  async findByPhone(phone: string): Promise<Ca | null> {
    return this.caModel.findOne({ 'form_data.phone': phone }).exec();
  }
}
