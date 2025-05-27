import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Story } from '@prisma/client';
import OpenAI from 'openai';
import {
  getGenerateStoryPrompt,
  StoryPromptContext,
} from 'src/prompts/story.prompt';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
interface GenerateStoryOptions {
  theme?: string;
  length?: 'short' | 'medium' | 'long';
}

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}
  private openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

  async findAll(): Promise<Story[]> {
    return this.prisma.story.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number): Promise<Story> {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async create(data: Prisma.StoryCreateInput): Promise<Story> {
    return this.prisma.story.create({ data });
  }

  async update(id: number, data: Prisma.StoryUpdateInput): Promise<Story> {
    return this.prisma.story.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Story> {
    return this.prisma.story.delete({ where: { id } });
  }

  /**
   * Generate and save a new story based on unit context and AI prompt
   */
  async generateStory(
    unitId: number,
    options: GenerateStoryOptions,
  ): Promise<Story> {
    // 1) load unit context
    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
      include: { section: true, vocabulary: true },
    });
    if (!unit) {
      throw new NotFoundException(`Unit ${unitId} not found`);
    }

    // 2) build prompt context
    const ctx: StoryPromptContext = {
      unitName: unit.name ?? `Unit ${unitId}`,
      cefrLevel: unit.section.cefr,
      vocabWords: unit.vocabulary.map((v) => v.word).join(', '),
    };
    const prompt = getGenerateStoryPrompt(ctx, options);

    // 3) ask OpenAI and parse JSON in one go
    const payload = await this.callOpenAI<{
      title: string;
      content: string;
      keywords: string;
    }>([
      { role: 'system', content: 'Return only raw JSON.' },
      { role: 'user', content: prompt },
    ]);

    // 4) payload is now strongly typed: { title, content, keywords }
    const { title, content, keywords } = payload;

    // 5) save and return
    return this.prisma.story.create({
      data: {
        title,
        content,
        keywords,
        audioUrl: null,
        unitId,
      },
    });
  }

  private async callOpenAI<T = any>(
    messages: ChatCompletionMessageParam[],
  ): Promise<T> {
    const resp = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    let content = resp.choices?.[0]?.message?.content ?? '';
    content = content
      .trim()
      .replace(/^```(?:json)?/, '')
      .replace(/```$/, '');

    try {
      return JSON.parse(content) as T;
    } catch (err) {
      console.error('? JSON parse error:', content, err);
      throw new InternalServerErrorException(
        'Invalid JSON returned from OpenAI',
      );
    }
  }
}
