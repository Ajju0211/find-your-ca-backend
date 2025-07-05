import { Module } from '@nestjs/common';
import { CaService } from './ca.service';
import { CaController } from './ca.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Ca, CaSchema } from './schema/ca.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ca.name, schema: CaSchema }])],
  providers: [CaService],
  controllers: [CaController],
  exports: [MongooseModule],
})
export class CaModule {}
