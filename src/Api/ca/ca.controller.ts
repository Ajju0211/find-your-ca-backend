import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CaService } from './ca.service';
import { Ca } from './schema/ca.schema';
import { UpdateCaDto } from './dto/update-ca.dto';
import { Step3Dto } from './dto/step3.dto';
import { Step2Dto } from './dto/step2.dto';
import { Step1Dto } from './dto/step1.dto';
import { StepResponse, VerifiedCA } from './types/ca.types';
import { validateFormDataByType } from '../../utils/validate-form-data';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('ca')
export class CaController {
  constructor(private readonly caService: CaService) {}

  /**
   * @route POST /ca/registration/step1
   * @desc Step 1 - Register a new CA firm (basic info + form_data)
   *        Validates form_data dynamically based on CA firm type
   */
  @Post('registration/step1')
  async fillFormStep1(@Body() body: Step1Dto) {
    const { type, form_data, ...rest } = body;

    // ✅ Validate form_data manually
    const validatedFormData = await validateFormDataByType(type, form_data);

    // Now continue processing
    const finalData = {
      ...rest,
      type,
      form_data: validatedFormData,
    };
    return this.caService.submitFirmInfo(body);
  }

  /**
   * @route PATCH /ca/registration/step2
   * @desc Step 2 - Update CA expertise & services by tempId
   *        Called when the user finishes Step 2 of the form
   */
  @Patch('/registration/step2')
  async updateProgress(@Body() dto: Step2Dto): Promise<Partial<Ca>> {
    if (!dto.tempId) {
      throw new BadRequestException('tempId is required');
    }
    return this.caService.submitExpertise(dto.tempId, dto);
  }

  /**
   * @route PATCH /ca/registration/step3
   * @desc Step 3 - Set email & password to complete registration
   */
  @Patch('/registration/step3')
  async completeStep3(@Body() dto: Step3Dto): Promise<StepResponse> {
    return this.caService.submitLoginCredentials(dto);
  }

  /**
   * @route GET /ca/progress/:tempId
   * @desc Fetches the form data for a CA registration in progress using tempId
   */
  @Get('progress/:tempId')
  async getProgress(@Param('tempId') tempId: string): Promise<Partial<Ca>> {
    return await this.caService.findByTempId(tempId);
  }

  /**
   * @route PATCH /ca/update/:id
   * @desc Updates CA firm data by MongoDB _id (used post-registration)
   */
  @Patch('update/:id')
  @UseGuards(AuthGuard)
  async updateCa(
    @Param('id') id: string,
    @Body() updateCaDto: UpdateCaDto,
    @Req() req: any, // Inject request to access req.user
  ) {
    // Ensure logged-in user is only updating their own data
    const loggedInUserId = req.user?._id?.toString();
    // console.log('authId: ', loggedInUserId, 'Id: ', id);
    if (id !== loggedInUserId) {
      throw new UnauthorizedException(
        'You are not allowed to update this user',
      );
    }

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

  /**
   * @route GET /ca/verified
   * @desc Returns a list of all approved (verified) CA firms
   */
  @Get('verified')
  async findVerified(): Promise<VerifiedCA[]> {
    return this.caService.findVerified();
  }

  /**
   * @route GET /ca/filter
   * @desc Returns a filtered list of CA firms based on query params
   * @example ?city=Mumbai&industry=Finance&firm_size=medium
   */
  @Get('filter')
  filterCAs(@Query() query: any) {
    return this.caService.filterCAs(query);
  }

  /**
   * @route GET /ca/:id
   * @desc Fetch CA firm by MongoDB _id
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
