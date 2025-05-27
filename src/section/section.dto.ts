import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ example: 'Listening Skills' })
  title: string;

  @ApiProperty({ example: 'A2' })
  cefr: string;

  @ApiProperty({ example: 1 })
  order: number;
}

export class UpdateSectionDto {
  @ApiProperty({ example: 'Listening Skills' })
  title: string;

  @ApiProperty({ example: 'A2' })
  cefr: string;

  @ApiProperty({ example: 1 })
  order: number;
}

export class SectionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  cefr: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: string;
}
