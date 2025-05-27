import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CEFR } from '@prisma/client';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUnits(cefr?: CEFR) {
    return this.prisma.unit.findMany({
      where: cefr ? { section: { cefr } } : {},
      include: { section: true },
      orderBy: { order: 'asc' },
    });
  }

  async getQuizzesByUnit(unitId: number) {
    return this.prisma.quiz.findMany({
      where: { unitId },
      orderBy: { id: 'asc' },
    });
  }

  async createUnit(data: {
    name: string;
    grammarPoint: string;
    sectionId: number;
    order: number;
  }) {
    return this.prisma.unit.create({ data });
  }

  async updateUnit(
    id: number,
    data: {
      name: string;
      grammarPoint: string;
      sectionId: number;
      order: number;
    },
  ) {
    return this.prisma.unit.update({
      where: { id },
      data,
    });
  }

  async deleteUnit(id: number) {
    const dependent = await this.prisma.vocabularyItem.findFirst({
      where: { unitId: id },
    });

    if (dependent) {
      throw new HttpException(
        'Cannot delete unit with linked vocabulary.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.quiz.deleteMany({ where: { unitId: id } });
    return this.prisma.unit.delete({ where: { id } });
  }
}
