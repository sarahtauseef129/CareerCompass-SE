export class CreateAssessmentDto {
  userId: number;
  responses: Record<string, any>;
  interestScore?: number;
  skillScore?: number;
  environmentScore?: number;
}

export class AssessmentResponseDto {
  id: number;
  userId: number;
  responses: Record<string, any>;
  interestScore?: number;
  skillScore?: number;
  environmentScore?: number;
  createdAt: Date;
}

export class UpdateAssessmentScoresDto {
  interestScore: number;
  skillScore: number;
  environmentScore: number;
}
