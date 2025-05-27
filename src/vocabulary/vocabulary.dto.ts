import { ApiProperty } from '@nestjs/swagger';

export class CreateVocabularyDto {
  @ApiProperty()
  word: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  definition?: string;

  @ApiProperty()
  unitId: number;
}

export class UpdateVocabularyDto {
  @ApiProperty({ required: false })
  word?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  definition?: string;

  @ApiProperty({ required: false })
  unitId?: number;
}
