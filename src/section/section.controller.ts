import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSectionDto, SectionDto } from './section.dto';

@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  async getSections() {
    return this.sectionService.getAllSections();
  }

  @Get(':id/unit')
  async getUnitsBySection(@Param('id', ParseIntPipe) id: number) {
    return this.sectionService.getUnitsBySection(id);
  }
  @Post()
  @ApiOperation({ summary: 'Create a new section' })
  @ApiBody({ type: CreateSectionDto })
  @ApiResponse({
    status: 201,
    description: 'The section has been created',
    type: SectionDto,
  })
  async create(@Body() body: CreateSectionDto) {
    return this.sectionService.createSection(body);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title: string; cefr: string; order: number },
  ) {
    return this.sectionService.updateSection(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.sectionService.deleteSection(id);
  }
}
