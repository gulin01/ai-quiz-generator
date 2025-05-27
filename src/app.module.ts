// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { QuizModule } from './quiz/quiz.module';
import { SectionModule } from './section/section.module';
import { UnitModule } from './unit/unit.module';
import { StoryModule } from './story/story.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
    }),
    PrismaModule,
    QuizModule,
    SectionModule,
    UnitModule,
    StoryModule,
    VocabularyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
