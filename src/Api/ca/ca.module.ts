import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaController } from './ca.controller';
import { CaService } from './ca.service';
import { Ca, CaSchema } from './schema/ca.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ca.name, schema: CaSchema }])],
  providers: [CaService],
  controllers: [CaController],
  exports: [MongooseModule],
})
export class CaModule {}
