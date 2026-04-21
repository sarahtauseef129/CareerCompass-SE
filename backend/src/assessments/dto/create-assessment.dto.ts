import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateAssessmentDto {
  @IsNumber()
  userId: number;

  @IsObject()
  responses: Record<string, any>;

  @IsNumber()
  @IsOptional()
  interestScore?: number;

  @IsNumber()
  @IsOptional()
  skillScore?: number;

  @IsNumber()
  @IsOptional()
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
