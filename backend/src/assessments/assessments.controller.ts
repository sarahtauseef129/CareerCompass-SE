import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import {
  CreateAssessmentDto,
  AssessmentResponseDto,
  UpdateAssessmentScoresDto,
} from './dto/create-assessment.dto';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  /**
   * POST /assessments
   * Save new assessment for user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAssessment(
    @Body() createAssessmentDto: CreateAssessmentDto,
  ): Promise<AssessmentResponseDto> {
    return this.assessmentsService.createAssessment(createAssessmentDto);
  }

  /**
   * GET /assessments/user/:userId
   * Get latest assessment for user
   */
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserAssessment(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<AssessmentResponseDto> {
    return this.assessmentsService.getUserAssessment(userId);
  }

  /**
   * GET /assessments/user/:userId/all
   * Get all assessments for user
   */
  @Get('user/:userId/all')
  @HttpCode(HttpStatus.OK)
  async getUserAssessments(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<AssessmentResponseDto[]> {
    return this.assessmentsService.getUserAssessments(userId);
  }

  /**
   * PUT /assessments/:id/scores
   * Update assessment scores
   */
  @Put(':id/scores')
  @HttpCode(HttpStatus.OK)
  async updateAssessmentScores(
    @Param('id', ParseIntPipe) assessmentId: number,
    @Body() scoresDto: UpdateAssessmentScoresDto,
  ): Promise<AssessmentResponseDto> {
    return this.assessmentsService.updateAssessmentScores(assessmentId, scoresDto);
  }

  /**
   * DELETE /assessments/:id
   * Delete assessment
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAssessment(
    @Param('id', ParseIntPipe) assessmentId: number,
  ): Promise<{ message: string }> {
    await this.assessmentsService.deleteAssessment(assessmentId);
    return { message: 'Assessment deleted successfully' };
  }
}
