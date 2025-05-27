import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CEFR } from '@prisma/client';

@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  async getAll(@Query('cefr') cefr?: string) {
    return this.unitService.getAllUnits(cefr as CEFR);
  }

  @Get(':id/quizzes')
  async getQuizzes(@Param('id', ParseIntPipe) id: number) {
    return this.unitService.getQuizzesByUnit(id);
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      grammarPoint: string;
      sectionId: number;
      order: number;
    },
  ) {
    return this.unitService.createUnit(body);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      name: string;
      grammarPoint: string;
      sectionId: number;
      order: number;
    },
  ) {
    return this.unitService.updateUnit(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.unitService.deleteUnit(id);
  }
}
