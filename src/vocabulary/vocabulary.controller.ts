import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyItem } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateVocabularyDto, UpdateVocabularyDto } from './vocabulary.dto';

@ApiTags('Vocabulary')
@Controller('vocab')
export class VocabularyController {
  constructor(private readonly vocabService: VocabularyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vocabulary items' })
  @ApiResponse({ status: 200, description: 'List of vocabulary items' })
  findAll(): Promise<VocabularyItem[]> {
    return this.vocabService.findAll();
  }

  @Get('unit/:unitId')
  @ApiOperation({ summary: 'Get vocabulary by unit ID' })
  @ApiResponse({ status: 200, description: 'Vocabulary items for unit' })
  findByUnit(
    @Param('unitId', ParseIntPipe) unitId: number,
  ): Promise<VocabularyItem[]> {
    return this.vocabService.findByUnit(unitId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vocabulary item by ID' })
  @ApiResponse({ status: 200, description: 'A single vocabulary item' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<VocabularyItem> {
    return this.vocabService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vocabulary item' })
  @ApiResponse({ status: 201, description: 'The created vocabulary item' })
  create(@Body() dto: CreateVocabularyDto): Promise<VocabularyItem> {
    return this.vocabService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vocabulary item' })
  @ApiResponse({ status: 200, description: 'The updated vocabulary item' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVocabularyDto,
  ): Promise<VocabularyItem> {
    return this.vocabService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vocabulary item' })
  @ApiResponse({ status: 200, description: 'The deleted vocabulary item' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<VocabularyItem> {
    return this.vocabService.delete(id);
  }
}
