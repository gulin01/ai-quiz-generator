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
import { StoryService } from './story.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Story } from '@prisma/client';

class CreateStoryDto {
  title: string;
  content: string;
  audioUrl?: string;
  keywords?: string;
  unitId: number;
}

class UpdateStoryDto {
  title?: string;
  content?: string;
  audioUrl?: string;
  keywords?: string;
}

@ApiTags('Stories')
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stories' })
  @ApiResponse({ status: 200, description: 'List of stories' })
  findAll(): Promise<Story[]> {
    return this.storyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a story by ID' })
  @ApiResponse({ status: 200, description: 'A single story' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Story> {
    return this.storyService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new story' })
  @ApiResponse({ status: 201, description: 'The created story' })
  create(@Body() data: CreateStoryDto): Promise<Story> {
    return this.storyService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a story' })
  @ApiResponse({ status: 200, description: 'The updated story' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateStoryDto,
  ): Promise<Story> {
    return this.storyService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a story' })
  @ApiResponse({ status: 200, description: 'The deleted story' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<Story> {
    return this.storyService.delete(id);
  }

  @Post('unit/:unitId/generate-story')
  generateStory(
    @Param('unitId', ParseIntPipe) unitId: number,
    @Body() opts: { theme?: string; length?: 'short' | 'medium' | 'long' },
  ): Promise<Story> {
    console.log('Generating story with options:');
    return this.storyService.generateStory(unitId, opts);
  }
}
