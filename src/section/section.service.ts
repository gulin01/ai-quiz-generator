import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CEFR } from '@prisma/client';

@Injectable()
export class SectionService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSections() {
    return this.prisma.section.findMany({ orderBy: { order: 'asc' } });
  }

  async getUnitsBySection(sectionId: number) {
    return this.prisma.unit.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' },
    });
  }

  async createSection(data: { title: string; cefr: string; order: number }) {
    const exists = await this.prisma.section.findFirst({
      where: { title: data.title },
    });

    if (exists) {
      throw new HttpException(
        'Section title already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prisma.section.create({
      data: {
        title: data.title,
        cefr: data.cefr as CEFR, // ? Fix here
        order: data.order,
      },
    });
  }

  async updateSection(
    id: number,
    data: { title: string; cefr: string; order: number },
  ) {
    return this.prisma.section.update({
      where: { id },
      data: {
        title: data.title,
        cefr: data.cefr as CEFR,
        order: data.order,
      },
    });
  }

  async deleteSection(id: number) {
    const linkedUnits = await this.prisma.unit.findFirst({
      where: { sectionId: id },
    });

    if (linkedUnits) {
      throw new HttpException(
        'Cannot delete a section that has linked units',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prisma.section.delete({ where: { id } });
  }
}
