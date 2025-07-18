import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ca, CaDocument } from './schema/ca.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCaDto } from './dto/update-ca.dto';
import { Roles } from 'src/permissions/roles.decorator';
import { Step1Dto } from './dto/step1.dto';
import { Step3Dto } from './dto/step3.dto';
import { Step2Dto } from './dto/step2.dto';
import { PasswordService } from 'src/common/service/password.service';
import { StepResponse, VerifiedCA } from './types/ca.types';
@Injectable()
export class CaService {
  constructor(
    @InjectModel(Ca.name) private readonly caModel: Model<CaDocument>,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * Complete Step 3 of CA form - Signup/Login
   * This is called when user submits email/password after filling form
   */
  async submitLoginCredentials(dto: Step3Dto): Promise<StepResponse> {
    const exists = (await this.caModel.findOne({
      email: dto.email,
    })) as CaDocument;
    if (exists?.emailVerified)
      throw new ConflictException('Email already registered');

    const ca = await this.caModel.findOne({ tempId: dto.tempId });
    if (!ca) throw new NotFoundException('Form not found');

    if (ca.email != null && ca.email != dto.email)
      throw new BadRequestException(
        'Email mismatch. Kindly use the email you previously registered with.',
      );

    if (!ca?.emailVerified) {
      throw new ForbiddenException(
        'Email not verified. Please verify your email to continue.',
      );
    }

    // ✅ Hash password
    const hashed = await this.passwordService.hash(dto.password);

    // ✅ Update with Step 3 data
    await this.caModel.updateOne(
      { tempId: dto.tempId },
      {
        $set: {
          email: dto.email,
          password: hashed,
          form_step_progress: 3,
        },
        $addToSet: { completed_steps: 3 },
      },
    );

    const response = {
      success: true,
      message: 'Successfully signup',
      form_step_progress: 3,
      completed_steps: [1, 2, 3],
    };
    return response;
  }

  /**
   * Create a new CA Firm
   */
  async submitFirmInfo(createCaDto: Step1Dto): Promise<StepResponse> {
    // Check if phone exists
    const phoneExists = await this.findByPhone(createCaDto.form_data.phone);
    console.log('Phone Number: ', createCaDto.form_data.phone);
    if (phoneExists) {
      throw new BadRequestException('Phone number already in use');
    }

    const tempId = uuidv4();
    // ✅ Clean DTO to avoid undefined fields
    const cleanData = JSON.parse(JSON.stringify({ ...createCaDto, tempId })); // Removes undefined
    console.log(cleanData);
    const caToSave = new this.caModel(cleanData);
    caToSave.save();
    const response = {
      success: true,
      message: 'Step 1 completed',
      form_step_progress: 1,
      tempId: caToSave.tempId,
    };

    return response;
  }

  /**
   * Update Step 2 (Plan and Expertise) by Temp ID
   * Used to update form progress for step 2 specifically
   */
  async submitExpertise(tempId: string, dto: Step2Dto): Promise<StepResponse> {
    const existing = await this.caModel.findOne({ tempId });

    if (!existing) {
      throw new NotFoundException('No CA form found for this tempId');
    }

    // Track completed steps uniquely
    const currentSteps = new Set(existing.completed_steps || []);
    currentSteps.add(dto.form_step_progress);

    // Perform update (only for step 2 related fields)
    await this.caModel.updateOne(
      { tempId },
      {
        $set: {
          plan_and_expertise: dto.plan_and_expertise,
          form_step_progress: dto.form_step_progress,
          completed_steps: Array.from(currentSteps),
        },
      },
    );

    // Return updated document (sanitized)
    const response = {
      success: true,
      message: 'Step 2 updated',
      form_step_progress: 2,
      completed_steps: [1, 2],
    };

    return response;
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
      throw new NotFoundException(
        `CA firm with id ${id} not found after update`,
      );
    }

    const { password, ...sanitized } = updatedCa;
    return sanitized;
  }
  /**
   * 🔍 Find CA form by temporary ID (used for anonymous form resume)
   *
   * @param tempId - Temporary ID generated by frontend and stored in localStorage
   * @returns Sanitized CA document (no password) or throws NotFound
   */
  async findByTempId(tempId: string): Promise<Partial<Omit<Ca, 'password'>>> {
    if (!tempId || typeof tempId !== 'string') {
      throw new BadRequestException('Invalid or missing tempId');
    }

    const ca = await this.caModel.findOne({ tempId }).lean();

    if (!ca) {
      throw new NotFoundException('No CA form found for this tempId');
    }

    // 🔐 Remove sensitive fields before returning
    const { password, ...safeData } = ca;
    return safeData;
  }

  /**
   * Updates a CA document by its ID
   * @param id - The ID of the CA
   * @param dto - The update data
   * @returns Updated CA or throws if not found
   */
  async updateCa(id: string, dto: UpdateCaDto): Promise<Ca> {
    const updated = await this.caModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('CA not found');
    }

    return updated;
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
  async findVerified(): Promise<VerifiedCA[]> {
    const response = (await this.caModel
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
      .exec()) as VerifiedCA[];

    return response;
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
        {
          'plan_and_expertise.basic_services': {
            $in: [].concat(query.services),
          },
        },
        {
          'plan_and_expertise.advanced_services': {
            $in: [].concat(query.services),
          },
        },
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
    const phoneNumber = await this.caModel.findOne({
      'form_data.phone': phone,
    });
    return phoneNumber;
  }
}
