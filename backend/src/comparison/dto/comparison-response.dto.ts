import { CareerSkillDto } from '../../careers/dto/career-response.dto';

export class CareerComparisonItemDto {
  id: number;
  title: string;
  description?: string;
  educationPath?: string;
  industryOverview?: string;
  skills: CareerSkillDto[];
}

export class ComparisonResponseDto {
  careers: CareerComparisonItemDto[];
}