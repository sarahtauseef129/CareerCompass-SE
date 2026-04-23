//comparison.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { CompareCareersDto } from './dto/compare-careers.dto';
import { ComparisonResponseDto } from './dto/comparison-response.dto';

@Controller('compare')
export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  // UC-22: Compare careers side by side
  @Post()
  @HttpCode(HttpStatus.OK)
  async compareCareers(
    @Body() dto: CompareCareersDto,
  ): Promise<ComparisonResponseDto> {
    return this.comparisonService.compareCareers(dto);
  }
}