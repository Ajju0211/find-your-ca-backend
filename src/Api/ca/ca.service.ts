import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ca, CaDocument } from './schema/ca.schema';
import { Model } from 'mongoose';
import { CreateCaDto } from './dto/create-ca.dto';

@Injectable()
export class CaService {
  constructor(@InjectModel(Ca.name) private caModel: Model<CaDocument>) {}

  async create(CreateCaDto: CreateCaDto): Promise<Ca> {
    return await this.caModel.create(CreateCaDto);
  }

  async findAll(): Promise<Ca[]> {
    return this.caModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Ca> {
    const data: any = this.caModel.findById(id).exec();
    return data;
  }

  async deletCaById(id: string): Promise<{ deleted: boolean }> {
    const res = await this.caModel.deleteOne({ _id: id });
    return { deleted: res.deletedCount > 0 };
  }
}
