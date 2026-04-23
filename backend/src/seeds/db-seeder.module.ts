// src/seeds/db-seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from '../careers/entities/career.entity';
import { CareerSkill } from '../careers/entities/career-skill.entity';
import { User } from '../users/entities/user.entity';
import { DbSeederService } from './db-seeder.service';
import { DbSeederController } from './db-seeder.controller';
import { Roadmap } from '../roadmaps/entities/roadmap.entity';
import { RoadmapStep } from '../roadmaps/entities/roadmap-step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Career, CareerSkill, User, Roadmap, RoadmapStep])],
  providers: [DbSeederService],
  controllers: [DbSeederController],
  exports: [DbSeederService],
})
export class DbSeederModule {}
