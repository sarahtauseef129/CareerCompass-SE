import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationScore } from './entities/recommendation-score.entity';
import { Career } from '../careers/entities/career.entity';
import { User } from '../users/entities/user.entity';
import {
  RecommendationWithCareerDto,
  RecommendationScoreDto,
  UserRecommendationsResponseDto,
  UserScoresResponseDto,
} from './dto/recommendation-response.dto';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(RecommendationScore)
    private recommendationScoreRepository: Repository<RecommendationScore>,
    @InjectRepository(Career)
    private careersRepository: Repository<Career>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Get top 5 career recommendations for a user
   */
  async getUserRecommendations(
    userId: number,
  ): Promise<UserRecommendationsResponseDto> {
    // Verify user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get top 5 recommendations for the user, sorted by score DESC
    const recommendations = await this.recommendationScoreRepository.find({
      where: { userId },
      relations: ['career'],
      order: {
        score: 'DESC',
      },
      take: 5,
    });

    return {
      recommendations: recommendations.map((rec) =>
        this.mapToRecommendationWithCareer(rec),
      ),
    };
  }

  /**
   * Get detailed scores for a user's recommendations
   */
  async getDetailedScores(userId: number): Promise<UserScoresResponseDto> {
    // Verify user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get all recommendation scores for the user
    const scores = await this.recommendationScoreRepository.find({
      where: { userId },
      order: {
        score: 'DESC',
      },
    });

    return {
      userId,
      recommendations: scores.map((score) => this.mapToScoreDto(score)),
    };
  }

  /**
   * Get recommendations for a user with all details
   */
  async getUserRecommendationsWithDetails(
    userId: number,
  ): Promise<RecommendationScore[]> {
    // Verify user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.recommendationScoreRepository.find({
      where: { userId },
      relations: ['career', 'user'],
      order: {
        score: 'DESC',
      },
    });
  }

  /**
   * Generate recommendations for a user based on assessment scores
   */
  async generateRecommendationsFromAssessment(
    userId: number,
    interestScore: number,
    skillScore: number,
    environmentScore: number,
  ): Promise<RecommendationScore[]> {
    // Verify user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get all careers
    const careers = await this.careersRepository.find({
      relations: ['skills'],
    });

    if (!careers || careers.length === 0) {
      throw new NotFoundException('No careers available in database');
    }

    // Clear existing recommendations for this user to avoid duplicates
    await this.recommendationScoreRepository.delete({ userId });

    // Generate recommendations for each career
    const recommendations: RecommendationScore[] = [];

    for (const career of careers) {
      // Calculate match score as weighted average of the three dimensions
      // Weights: Interest 40%, Skill 40%, Environment 20%
      const finalScore = (interestScore * 0.4 + skillScore * 0.4 + environmentScore * 0.2);

      // Add some variation based on career to make it more realistic
      // (In production, this could include user profile matching)
      const variationFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const adjustedScore = Math.min(5, finalScore * variationFactor);

      const recommendation = this.recommendationScoreRepository.create({
        userId,
        careerId: career.id,
        score: Math.round(adjustedScore * 100) / 100, // Round to 2 decimals
        interestScore: Math.round(interestScore * 100) / 100,
        skillScore: Math.round(skillScore * 100) / 100,
        environmentScore: Math.round(environmentScore * 100) / 100,
      });

      recommendations.push(recommendation);
    }

    // Save all recommendations
    const savedRecommendations = await this.recommendationScoreRepository.save(
      recommendations,
    );

    console.log(`Generated ${savedRecommendations.length} recommendations for user ${userId}`);

    return savedRecommendations;
  }

  /**
   * Map RecommendationScore to RecommendationWithCareerDto
   */
  private mapToRecommendationWithCareer(
    rec: RecommendationScore,
  ): RecommendationWithCareerDto {
    return {
      id: rec.id,
      careerTitle: rec.career?.title || 'Unknown',
      careerDescription: rec.career?.description,
      score: rec.score,
      interestScore: rec.interestScore,
      skillScore: rec.skillScore,
      environmentScore: rec.environmentScore,
      createdAt: rec.createdAt,
    };
  }

  /**
   * Map RecommendationScore to RecommendationScoreDto
   */
  private mapToScoreDto(score: RecommendationScore): RecommendationScoreDto {
    return {
      id: score.id,
      score: score.score,
      interestScore: score.interestScore,
      skillScore: score.skillScore,
      environmentScore: score.environmentScore,
      createdAt: score.createdAt,
    };
  }
}
