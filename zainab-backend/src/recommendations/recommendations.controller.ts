import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import {
  UserRecommendationsResponseDto,
  UserScoresResponseDto,
} from './dto/recommendation-response.dto';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  /**
   * GET /recommendations/:userId
   * Returns top 5 career recommendations for a user
   */
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getUserRecommendations(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserRecommendationsResponseDto> {
    return this.recommendationsService.getUserRecommendations(userId);
  }

  /**
   * GET /recommendations/:userId/scores
   * Returns detailed scores for a user's recommendations
   */
  @Get(':userId/scores')
  @HttpCode(HttpStatus.OK)
  async getDetailedScores(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserScoresResponseDto> {
    return this.recommendationsService.getDetailedScores(userId);
  }
}
