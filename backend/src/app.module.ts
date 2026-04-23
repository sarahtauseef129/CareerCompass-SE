//app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { CareersModule } from './careers/careers.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { DbSeederModule } from './seeds/db-seeder.module';
import { ComparisonModule } from './comparison/comparison.module';
import { RoadmapModule } from './roadmaps/roadmap.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PublicContentModule } from './public-content/public-content.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,
    CareersModule,
    RecommendationsModule,
    AssessmentsModule,
    DbSeederModule,
    RoadmapModule,
    ComparisonModule,
    BookmarksModule,
    FeedbackModule,
    PublicContentModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}