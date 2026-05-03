//comparisonApi.ts
import { apiCall } from './api';
import { CareerResponseDto } from './careersApi';

export interface ComparisonResponseDto {
  careers: CareerResponseDto[];
}

export async function compareCareers(careerIds: number[]): Promise<ComparisonResponseDto> {
  return apiCall<ComparisonResponseDto>('/compare', {
    method: 'POST',
    body: JSON.stringify({ careerIds }),
  });
}