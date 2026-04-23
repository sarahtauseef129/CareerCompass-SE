import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { RoadmapStep } from './entities/roadmap-step.entity';
import { RoadmapProgress } from './entities/roadmap-progress.entity';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import {
  RoadmapResponseDto,
  RoadmapProgressDto,
} from './dto/roadmap-response.dto';

@Injectable()
export class RoadmapService {
  constructor(
    @InjectRepository(Roadmap)
    private roadmapRepo: Repository<Roadmap>,

    @InjectRepository(RoadmapStep)
    private stepRepo: Repository<RoadmapStep>,

    @InjectRepository(RoadmapProgress)
    private progressRepo: Repository<RoadmapProgress>,
  ) {}

  // UC-18: Get roadmap for a career
  async getRoadmapByCareer(careerId: number): Promise<RoadmapResponseDto> {
    const roadmap = await this.roadmapRepo.findOne({
      where: { career: { id: careerId } },
      relations: ['steps', 'career'],
    });

    if (!roadmap) {
      throw new NotFoundException(
        `Roadmap for career ID ${careerId} not found`,
      );
    }

    // sort steps manually since nested order isn't supported
    const sortedSteps = (roadmap.steps ?? []).sort(
      (a, b) => a.stepOrder - b.stepOrder,
    );

    return {
      id: roadmap.id,
      careerId,
      title: roadmap.title,
      description: roadmap.description,
      steps: sortedSteps.map((step) => ({
        id: step.id,
        title: step.title,
        description: step.description,
        stepOrder: step.stepOrder,
        createdAt: step.createdAt,
      })),
      createdAt: roadmap.createdAt,
    };
  }

  // UC-19: Get user progress on a roadmap
  async getUserProgress(
    careerId: number,
    userId: number,
  ): Promise<RoadmapProgressDto[]> {
    const roadmap = await this.roadmapRepo.findOne({
      where: { career: { id: careerId } },
      relations: ['steps'],
    });

    if (!roadmap) {
      throw new NotFoundException(
        `Roadmap for career ID ${careerId} not found`,
      );
    }

    const progressRecords = await this.progressRepo.find({
      where: { user: { id: userId } },
      relations: ['roadmapStep'],
      order: { priorityOrder: 'ASC' },
    });

    const steps = (roadmap.steps ?? []).sort(
      (a, b) => a.stepOrder - b.stepOrder,
    );

    return steps.map((step) => {
      const progress = progressRecords.find(
        (p) => p.roadmapStep.id === step.id,
      );
      return {
        id: progress?.id ?? null,
        stepId: step.id,
        stepTitle: step.title,
        completed: progress?.completed ?? false,
        completedAt: progress?.completedAt ?? null,
        priorityOrder: progress?.priorityOrder ?? step.stepOrder,
      };
    });
  }

  // UC-20: Mark a step complete/incomplete
  async updateStepProgress(
    userId: number,
    dto: UpdateRoadmapDto,
  ): Promise<RoadmapProgressDto> {
    if (!dto.progress) {
      throw new BadRequestException('Progress data is required');
    }

    const { stepId, completed } = dto.progress;

    const step = await this.stepRepo.findOne({ where: { id: stepId } });
    if (!step) {
      throw new NotFoundException(`Step with ID ${stepId} not found`);
    }

    let progress = await this.progressRepo.findOne({
      where: { user: { id: userId }, roadmapStep: { id: stepId } },
      relations: ['roadmapStep'],
    });

    if (!progress) {
      progress = this.progressRepo.create({
        user: { id: userId } as any,
        roadmapStep: { id: stepId } as any,
        completed,
        completedAt: completed ? new Date() : null,
      });
    } else {
      progress.completed = completed;
      progress.completedAt = completed ? new Date() : null;
    }

    const saved = await this.progressRepo.save(progress);

    return {
      id: saved.id,
      stepId,
      stepTitle: step.title,
      completed: saved.completed,
      completedAt: saved.completedAt,
      priorityOrder: saved.priorityOrder,
    };
  }

  // UC-21: Update priority order of a step
  async updateStepPriority(
    userId: number,
    dto: UpdateRoadmapDto,
  ): Promise<RoadmapProgressDto> {
    if (!dto.priority) {
      throw new BadRequestException('Priority data is required');
    }

    const { stepId, priorityOrder } = dto.priority;

    const step = await this.stepRepo.findOne({ where: { id: stepId } });
    if (!step) {
      throw new NotFoundException(`Step with ID ${stepId} not found`);
    }

    let progress = await this.progressRepo.findOne({
      where: { user: { id: userId }, roadmapStep: { id: stepId } },
      relations: ['roadmapStep'],
    });

    if (!progress) {
      progress = this.progressRepo.create({
        user: { id: userId } as any,
        roadmapStep: { id: stepId } as any,
        priorityOrder,
      });
    } else {
      progress.priorityOrder = priorityOrder;
    }

    const saved = await this.progressRepo.save(progress);

    return {
      id: saved.id,
      stepId,
      stepTitle: step.title,
      completed: saved.completed,
      completedAt: saved.completedAt,
      priorityOrder: saved.priorityOrder,
    };
  }
}