import { apiCall } from './api';

export interface CareerSkillDto {
  id: number;
  skillName: string;
  importanceLevel: number;
  createdAt: string;
}

export interface CareerResponseDto {
  id: number;
  title: string;
  description?: string;
  educationPath?: string;
  industryOverview?: string;
  skills?: CareerSkillDto[];
  createdAt: string;
}

export interface CareerValidationResponseDto {
  valid: boolean;
  issues: string[];
}

/**
 * Fetch all careers with their skills
 */
export async function getAllCareers(): Promise<CareerResponseDto[]> {
  return apiCall<CareerResponseDto[]>('/careers');
}

/**
 * Fetch a single career by ID with all its skills
 */
export async function getCareerById(id: number): Promise<CareerResponseDto> {
  return apiCall<CareerResponseDto>(`/careers/${id}`);
}

/**
 * Validate all career data
 */
export async function validateCareerData(): Promise<CareerValidationResponseDto> {
  return apiCall<CareerValidationResponseDto>('/careers/validate/data');
}
