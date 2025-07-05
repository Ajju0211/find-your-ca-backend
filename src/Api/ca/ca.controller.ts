import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CaService } from './ca.service';
import { CreateCaDto } from './dto/create-ca.dto';
import { Ca } from './schema/ca.schema';

@Controller('ca')
export class CaController {
  constructor(private readonly caService: CaService) {}

  @Post('create')
  async create(@Body() body: CreateCaDto): Promise<Ca> {
    return await this.caService.create(body);
  }

  @Get()
  async findAll(): Promise<Ca[]> {
    return await this.caService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Ca> {
    return await this.caService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.caService.deletCaById(id);
  }
}
