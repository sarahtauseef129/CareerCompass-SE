export class RecommendationScoreDto {
  id: number;
  score: number;
  interestScore: number;
  skillScore: number;
  environmentScore: number;
  createdAt: Date;
}

export class RecommendationWithCareerDto {
  id: number;
  careerTitle: string;
  careerDescription?: string;
  score: number;
  interestScore: number;
  skillScore: number;
  environmentScore: number;
  createdAt: Date;
}

export class UserRecommendationsResponseDto {
  recommendations: RecommendationWithCareerDto[];
}

export class UserScoresResponseDto {
  userId: number;
  recommendations: RecommendationScoreDto[];
}
