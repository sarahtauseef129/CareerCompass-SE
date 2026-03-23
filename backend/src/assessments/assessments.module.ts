import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';
import { Assessment } from './entities/assessment.entity';
import { User } from '../users/entities/user.entity';
import { RecommendationsModule } from '../recommendations/recommendations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assessment, User]),
    RecommendationsModule,
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
