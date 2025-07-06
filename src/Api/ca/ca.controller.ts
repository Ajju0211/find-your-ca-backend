import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CaService } from './ca.service';
import { CreateCaDto } from './dto/create-ca.dto';
import { Ca } from './schema/ca.schema';
import { getFormDtoClass } from '../utils/form-type-mapper';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('ca')
export class CaController {
  constructor(private readonly caService: CaService) { }

  /**
   * @route POST /ca
   * @desc Creates a new CA firm after validating form_data dynamically based on CA firm type
   */
  @Post()

  async signUp(@Body() body: any) {
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
