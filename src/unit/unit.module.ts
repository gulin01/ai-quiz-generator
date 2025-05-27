// src/unit/unit.module.ts
import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UnitController } from './unit.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService],
})
export class UnitModule {}
