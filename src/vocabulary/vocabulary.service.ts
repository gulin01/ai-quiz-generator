import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, VocabularyItem } from '@prisma/client';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<VocabularyItem[]> {
    return this.prisma.vocabularyItem.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findByUnit(unitId: number): Promise<VocabularyItem[]> {
    return this.prisma.vocabularyItem.findMany({
      where: { unitId },
    });
  }

  async findOne(id: number): Promise<VocabularyItem> {
    const vocab = await this.prisma.vocabularyItem.findUnique({
      where: { id },
    });
    if (!vocab) throw new NotFoundException('Vocabulary item not found');
    return vocab;
  }

  async create(dto: {
    word: string;
    imageUrl?: string;
    definition?: string;
    unitId: number;
  }): Promise<VocabularyItem> {
    const { unitId, ...rest } = dto;

    return this.prisma.vocabularyItem.create({
      data: {
        ...rest,
        unit: {
          connect: { id: unitId },
        },
      },
    });
  }

  async update(
    id: number,
    data: Prisma.VocabularyItemUpdateInput,
  ): Promise<VocabularyItem> {
    return this.prisma.vocabularyItem.update({ where: { id }, data });
  }

  async delete(id: number): Promise<VocabularyItem> {
    return this.prisma.vocabularyItem.delete({ where: { id } });
  }
}
