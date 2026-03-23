import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './entities/career.entity';
import { CareerSkill } from './entities/career-skill.entity';
import {
  CareerResponseDto,
  CareerValidationResponseDto,
} from './dto/career-response.dto';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career)
    private careersRepository: Repository<Career>,
    @InjectRepository(CareerSkill)
    private careerSkillsRepository: Repository<CareerSkill>,
  ) {}

  /**
   * Find all careers
   */
  async findAll(): Promise<CareerResponseDto[]> {
    const careers = await this.careersRepository.find({
      relations: ['skills'],
      order: {
        createdAt: 'DESC',
      },
    });

    return careers.map((career) => this.mapToResponseDto(career));
  }

  /**
   * Find a single career by ID
   */
  async findOne(id: number): Promise<CareerResponseDto> {
    const career = await this.getCareerWithSkills(id);

    if (!career) {
      throw new NotFoundException(`Career with ID ${id} not found`);
    }

    return this.mapToResponseDto(career);
  }

  /**
   * Get career with all its skills (relations)
   */
  async getCareerWithSkills(id: number): Promise<Career | null> {
    return this.careersRepository.findOne({
      where: { id },
      relations: ['skills'],
    });
  }

  /**
   * Validate career data integrity
   */
  async validateCareerData(): Promise<CareerValidationResponseDto> {
    const issues: string[] = [];

    // Get all careers
    const careers = await this.careersRepository.find({
      relations: ['skills'],
    });

    for (const career of careers) {
      // Check if title exists
      if (!career.title || career.title.trim() === '') {
        issues.push(`Career ID ${career.id}: Missing or empty title`);
      }

      // Check if description exists
      if (!career.description || career.description.trim() === '') {
        issues.push(
          `Career ID ${career.id} (${career.title}): Missing or empty description`,
        );
      }

      // Check if at least 1 skill exists
      if (!career.skills || career.skills.length === 0) {
        issues.push(
          `Career ID ${career.id} (${career.title}): No skills defined`,
        );
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  /**
   * Map Career entity to response DTO
   */
  private mapToResponseDto(career: Career): CareerResponseDto {
    return {
      id: career.id,
      title: career.title,
      description: career.description,
      educationPath: career.educationPath,
      industryOverview: career.industryOverview,
      skills: career.skills?.map((skill) => ({
        id: skill.id,
        skillName: skill.skillName,
        importanceLevel: skill.importanceLevel,
        createdAt: skill.createdAt,
      })),
      createdAt: career.createdAt,
    };
  }
}
