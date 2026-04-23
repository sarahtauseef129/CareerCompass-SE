import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { RoadmapStep } from './entities/roadmap-step.entity';
import { RoadmapProgress } from './entities/roadmap-progress.entity';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap, RoadmapStep, RoadmapProgress])],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {}