// backend/modules/section.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

@Module({
  imports: [PrismaModule],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
