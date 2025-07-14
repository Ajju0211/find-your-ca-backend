import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './schema/contact.schema';
import { Model } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private contactModel: Model<ContactDocument>) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const newMessage = new this.contactModel(createContactDto);
    return await newMessage.save();
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Contact> {
    return this.contactModel.findById(id).exec() as any ;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const res = await this.contactModel.deleteOne({ _id: id });
    return { deleted: res.deletedCount > 0 };
  }
}
