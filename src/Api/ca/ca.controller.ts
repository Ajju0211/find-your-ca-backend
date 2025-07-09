import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CaService } from './ca.service';
import { CreateCaDto } from './dto/create-ca.dto';
import { Ca } from './schema/ca.schema';
import { getFormDtoClass } from '../utils/form-type-mapper';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateCaDto } from './dto/update-ca.dto';
import { Step3Dto } from './dto/step3.dto';
import { Step2Dto } from './dto/step2.dto';

@Controller('ca')
export class CaController {
  constructor(private readonly caService: CaService) {}

  /**
   * Step 1: Sign up a new CA firm
   * This endpoint dynamically validates the form_data based on the CA firm type
   * @route POST /ca
   * @desc Creates a new CA firm after validating form_data dynamically based on CA firm type
   */
  @Post()
  async fillFormStep1(@Body() body: any) {
    // Dynamically get the form DTO class based on firm type
    const FormDto = getFormDtoClass(body.type);

    // Validate the form_data based on selected DTO
    const formData = plainToInstance(FormDto, body.form_data);
    const errors = await validate(formData);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Reassign the validated form_data back to body
    body.form_data = formData;

    // Validate the rest of the CA data and pass it to the service
    const caDto = plainToInstance(CreateCaDto, body);
    return this.caService.signUp(caDto);
  }

  /**
   * Update CA information step-by-step using tempId
   */
  @Patch('progress/step2')
  async updateProgress(@Body() dto: Step2Dto): Promise<Partial<Ca>> {
    if (!dto.tempId) {
      throw new BadRequestException('tempId is required');
    }

    return this.caService.updateStep2ByTempId(dto.tempId, dto);
  }

  /**
   * @route PATCH /ca/progress/step3
   * @desc Completes Step 3 of CA form - Signup/Login
   * This is called when user submits email/password after filling form
   */
  @Patch('/progress/step3')
  async completeStep3(@Body() dto: Step3Dto): Promise<Ca> {
    return this.caService.completeStep3(dto);
  }

  // ✅ GET /ca/progress/:tempId → Fetch saved form
  @Get('progress/:tempId')
  async getProgress(@Param('tempId') tempId: string): Promise<Partial<Ca>> {
    return await this.caService.findByTempId(tempId);
  }

  /**
   * @route PATCH /ca/update/:id
   * @desc Updates a CA firm by ID
   * @param id - The ID of the CA firm to update
   * @param updateCaDto - The data to update the CA firm with
   * @returns The updated CA firm
   */
  @Patch('update/:id')
  async updateCa(
    @Param('id') id: string,
    @Body() updateCaDto: UpdateCaDto,
    @Req() req: Request & { user?: any },
  ) {
    return this.caService.updateCa(id, updateCaDto);
  }

  /**
   * @route GET /ca
   * @desc Returns a list of all CA firms
   */

  @Get()
  async findAll(): Promise<Ca[]> {
    return this.caService.findAll();
  }

  // ca.controller.ts

  /**
   * @route GET /ca/verified
   * @desc Returns a list of all verified CA firms (isApproved = true)
   */
  @Get('verified')
  async findVerified(): Promise<Ca[]> {
    return this.caService.findVerified();
  }

  /**
   * @route GET /ca/filter
   * @desc Returns CA firms filtered by query parameters (city, industry, service, type, etc.)
   * @example /ca/filter?city=Mumbai&industry=Finance
   */
  @Get('filter')
  filterCAs(@Query() query: any) {
    return this.caService.filterCAs(query);
  }

  /**
   * @route GET /ca/:id
   * @desc Returns a single CA firm by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Ca> {
    return this.caService.findOne(id);
  }

  /**
   * @route DELETE /ca/:id
   * @desc Deletes a CA firm by ID
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.caService.deleteCaById(id);
  }
}
