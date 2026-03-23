import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CareersService } from './careers.service';
import {
  CareerResponseDto,
  CareerValidationResponseDto,
} from './dto/career-response.dto';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  /**
   * GET /careers
   * Returns all careers with their skills
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<CareerResponseDto[]> {
    return this.careersService.findAll();
  }

  /**
   * GET /careers/:id
   * Returns a single career with its skills
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CareerResponseDto> {
    return this.careersService.findOne(id);
  }

  /**
   * GET /careers/validate/data
   * Validates all career data for integrity
   */
  @Get('validate/data')
  @HttpCode(HttpStatus.OK)
  async validateData(): Promise<CareerValidationResponseDto> {
    return this.careersService.validateCareerData();
  }
}
