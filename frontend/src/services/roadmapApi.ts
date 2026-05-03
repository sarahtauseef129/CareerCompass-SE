//roadmapApi.ts
import { apiCall } from './api';

export interface RoadmapStepDto {
  id: number;
  title: string;
  description: string;
  stepOrder: number;
  createdAt: string;
}

export interface RoadmapResponseDto {
  id: number;
  careerId: number;
  title: string;
  description: string;
  steps: RoadmapStepDto[];
  createdAt: string;
}

export interface RoadmapProgressDto {
  id: number | null;
  stepId: number;
  stepTitle: string;
  completed: boolean;
  completedAt: string | null;
  priorityOrder: number;
}

export async function getRoadmap(careerId: number): Promise<RoadmapResponseDto> {
  return apiCall<RoadmapResponseDto>(`/roadmap/${careerId}`);
}

export async function getRoadmapProgress(careerId: number): Promise<RoadmapProgressDto[]> {
  return apiCall<RoadmapProgressDto[]>(`/roadmap/${careerId}/progress`);
}

export async function markStepComplete(stepId: number, completed: boolean): Promise<RoadmapProgressDto> {
  return apiCall<RoadmapProgressDto>('/roadmap/update', {
    method: 'POST',
    body: JSON.stringify({ progress: { stepId, completed } }),
  });
}

export async function updateStepPriority(stepId: number, priorityOrder: number): Promise<RoadmapProgressDto> {
  return apiCall<RoadmapProgressDto>('/roadmap/update', {
    method: 'POST',
    body: JSON.stringify({ priority: { stepId, priorityOrder } }),
  });
}