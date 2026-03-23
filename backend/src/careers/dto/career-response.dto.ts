export class CareerSkillDto {
  id: number;
  skillName: string;
  importanceLevel: number;
  createdAt: Date;
}

export class CareerResponseDto {
  id: number;
  title: string;
  description?: string;
  educationPath?: string;
  industryOverview?: string;
  skills?: CareerSkillDto[];
  createdAt: Date;
}

export class CareerValidationResponseDto {
  valid: boolean;
  issues: string[];
}
