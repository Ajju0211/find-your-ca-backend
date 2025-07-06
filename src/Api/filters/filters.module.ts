import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { Ca, CaSchema } from 'src/Api/ca/schema/ca.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ca.name, schema: CaSchema }])],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
