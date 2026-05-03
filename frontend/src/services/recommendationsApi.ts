//recomendationsApi.ts
import { apiCall } from './api';

export interface RecommendationScoreDto {
  id: number;
  score: number;
  interestScore: number;
  skillScore: number;
  environmentScore: number;
  createdAt: string;
}

export interface RecommendationWithCareerDto {
  id: number;
  careerTitle: string;
  careerDescription?: string;
  score: number;
  interestScore: number;
  skillScore: number;
  environmentScore: number;
  createdAt: string;
}

export interface UserRecommendationsResponseDto {
  recommendations: RecommendationWithCareerDto[];
}

export interface UserScoresResponseDto {
  userId: number;
  recommendations: RecommendationScoreDto[];
}

/**
 * Get top 5 career recommendations for a user
 */
export async function getUserRecommendations(
  userId: number
): Promise<UserRecommendationsResponseDto> {
  return apiCall<UserRecommendationsResponseDto>(
    `/recommendations/${userId}`
  );
}

/**
 * Get detailed scores for a user's recommendations
 */
export async function getUserDetailedScores(
  userId: number
): Promise<UserScoresResponseDto> {
  return apiCall<UserScoresResponseDto>(
    `/recommendations/${userId}/scores`
  );
}
