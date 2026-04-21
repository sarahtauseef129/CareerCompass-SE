import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { User } from '../users/entities/user.entity';
import {
  CreateAssessmentDto,
  AssessmentResponseDto,
  UpdateAssessmentScoresDto,
} from './dto/create-assessment.dto';
import { RecommendationsService } from '../recommendations/recommendations.service';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentsRepository: Repository<Assessment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private recommendationsService: RecommendationsService,
  ) {}

  /**
   * Save assessment for a user
   */
  async createAssessment(createAssessmentDto: CreateAssessmentDto): Promise<AssessmentResponseDto> {
    // Verify user exists
    const user = await this.usersRepository.findOne({
      where: { id: createAssessmentDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createAssessmentDto.userId} not found`);
    }

    if (!createAssessmentDto.responses || Object.keys(createAssessmentDto.responses).length === 0) {
      throw new BadRequestException('Assessment responses cannot be empty');
    }

    // Create assessment
    const assessment = this.assessmentsRepository.create(createAssessmentDto);
    const saved = await this.assessmentsRepository.save(assessment);

    // Generate recommendations based on assessment scores
    try {
      if (
        createAssessmentDto.interestScore !== null && createAssessmentDto.interestScore !== undefined &&
        createAssessmentDto.skillScore !== null && createAssessmentDto.skillScore !== undefined &&
        createAssessmentDto.environmentScore !== null && createAssessmentDto.environmentScore !== undefined
      ) {
        await this.recommendationsService.generateRecommendationsFromAssessment(
          createAssessmentDto.userId,
          createAssessmentDto.interestScore,
          createAssessmentDto.skillScore,
          createAssessmentDto.environmentScore,
        );
        console.log(`Generated recommendations for user ${createAssessmentDto.userId}`);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Don't fail the assessment save if recommendations generation fails
    }

    return this.mapToResponseDto(saved);
  }

  /**
   * Get latest assessment for user
   */
  async getUserAssessment(userId: number): Promise<AssessmentResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const assessment = await this.assessmentsRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!assessment) {
      throw new NotFoundException(`No assessment found for user ${userId}`);
    }

    return this.mapToResponseDto(assessment);
  }

  /**
   * Get all assessments for user
   */
  async getUserAssessments(userId: number): Promise<AssessmentResponseDto[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const assessments = await this.assessmentsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return assessments.map((a) => this.mapToResponseDto(a));
  }

  /**
   * Update assessment scores
   */
  async updateAssessmentScores(
    assessmentId: number,
    scoresDto: UpdateAssessmentScoresDto,
  ): Promise<AssessmentResponseDto> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${assessmentId} not found`);
    }

    assessment.interestScore = scoresDto.interestScore;
    assessment.skillScore = scoresDto.skillScore;
    assessment.environmentScore = scoresDto.environmentScore;

    const updated = await this.assessmentsRepository.save(assessment);
    return this.mapToResponseDto(updated);
  }

  /**
   * Delete assessment
   */
  async deleteAssessment(assessmentId: number): Promise<void> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${assessmentId} not found`);
    }

    await this.assessmentsRepository.remove(assessment);
  }

  /**
   * Map Assessment to ResponseDto
   */
  private mapToResponseDto(assessment: Assessment): AssessmentResponseDto {
    return {
      id: assessment.id,
      userId: assessment.userId,
      responses: assessment.responses,
      interestScore: assessment.interestScore,
      skillScore: assessment.skillScore,
      environmentScore: assessment.environmentScore,
      createdAt: assessment.createdAt,
    };
  }
}
