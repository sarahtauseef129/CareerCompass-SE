import { apiCall } from './api';

export interface AssessmentResponseDto {
  id: number;
  userId: number;
  responses: Record<string, any>;
  interestScore?: number;
  skillScore?: number;
  environmentScore?: number;
  createdAt: string;
}

export interface CreateAssessmentDto {
  userId: number;
  responses: Record<string, any>;
  interestScore?: number;
  skillScore?: number;
  environmentScore?: number;
}

export interface UpdateAssessmentScoresDto {
  interestScore: number;
  skillScore: number;
  environmentScore: number;
}

/**
 * Save assessment responses for user
 */
export async function saveAssessment(
  assessmentData: CreateAssessmentDto
): Promise<AssessmentResponseDto> {
  return apiCall<AssessmentResponseDto>('/assessments', {
    method: 'POST',
    body: JSON.stringify(assessmentData),
  });
}

/**
 * Get latest assessment for user
 */
export async function getUserAssessment(
  userId: number
): Promise<AssessmentResponseDto> {
  return apiCall<AssessmentResponseDto>(`/assessments/user/${userId}`);
}

/**
 * Get all assessments for user
 */
export async function getUserAssessments(
  userId: number
): Promise<AssessmentResponseDto[]> {
  return apiCall<AssessmentResponseDto[]>(
    `/assessments/user/${userId}/all`
  );
}

/**
 * Update assessment scores
 */
export async function updateAssessmentScores(
  assessmentId: number,
  scores: UpdateAssessmentScoresDto
): Promise<AssessmentResponseDto> {
  return apiCall<AssessmentResponseDto>(
    `/assessments/${assessmentId}/scores`,
    {
      method: 'PUT',
      body: JSON.stringify(scores),
    }
  );
}

/**
 * Delete assessment
 */
export async function deleteAssessment(
  assessmentId: number
): Promise<{ message: string }> {
  return apiCall<{ message: string }>(`/assessments/${assessmentId}`, {
    method: 'DELETE',
  });
}
