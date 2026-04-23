// roadmap-response.dto.ts
export class RoadmapStepDto {
  id: number;
  title: string;
  description: string;
  stepOrder: number;
  createdAt: Date;
}

export class RoadmapResponseDto {
  id: number;
  careerId: number;
  title: string;
  description: string;
  steps: RoadmapStepDto[];
  createdAt: Date;
}

export class RoadmapProgressDto {
  id: number | null; // 👈 null when no progress record exists yet for this step
  stepId: number;
  stepTitle: string;
  completed: boolean;
  completedAt: Date | null;
  priorityOrder: number;
}