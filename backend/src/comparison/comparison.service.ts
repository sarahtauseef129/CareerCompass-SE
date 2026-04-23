//comparison.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CareersService } from '../careers/careers.service';
import { CompareCareersDto } from './dto/compare-careers.dto';
import { ComparisonResponseDto } from './dto/comparison-response.dto';

@Injectable()
export class ComparisonService {
  constructor(private readonly careersService: CareersService) {}

  async compareCareers(dto: CompareCareersDto): Promise<ComparisonResponseDto> {
    const { careerIds } = dto;

    if (!careerIds || careerIds.length < 2) {
      throw new BadRequestException('At least 2 career IDs are required');
    }

    if (careerIds.length > 4) {
      throw new BadRequestException('Cannot compare more than 4 careers at once');
    }

    // Fetch each career in parallel
    const careers = await Promise.all(
      careerIds.map((id) => this.careersService.findOne(id)),
    );

    return {
      careers: careers.map((career) => ({
        id: career.id,
        title: career.title,
        description: career.description,
        educationPath: career.educationPath,
        industryOverview: career.industryOverview,
        skills: career.skills ?? [],
      })),
    };
  }
}