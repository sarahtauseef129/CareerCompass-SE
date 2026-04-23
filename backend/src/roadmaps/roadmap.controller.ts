import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';

// Replace with real user ID from JWT once Person 1's auth is ready
const TEMP_USER_ID = 1;

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  // UC-18: View learning roadmap for a career
  @Get(':careerId')
  @HttpCode(HttpStatus.OK)
  getRoadmap(@Param('careerId', ParseIntPipe) careerId: number) {
    return this.roadmapService.getRoadmapByCareer(careerId);
  }

  // UC-19: Track roadmap progress for logged-in user
  @Get(':careerId/progress')
  @HttpCode(HttpStatus.OK)
  getProgress(@Param('careerId', ParseIntPipe) careerId: number) {
    return this.roadmapService.getUserProgress(careerId, TEMP_USER_ID);
  }

  // UC-20 + UC-21: Mark step complete or update priority
  @Post('update')
  @HttpCode(HttpStatus.OK)
  updateRoadmap(@Body() dto: UpdateRoadmapDto) {
    if (dto.progress) {
      return this.roadmapService.updateStepProgress(TEMP_USER_ID, dto);
    }
    if (dto.priority) {
      return this.roadmapService.updateStepPriority(TEMP_USER_ID, dto);
    }
  }
}