import {
  IsInt,
  IsBoolean,
  IsPositive,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStepProgressDto {
  @IsInt()
  @IsPositive()
  stepId: number;

  @IsBoolean()
  completed: boolean;
}

export class UpdatePriorityDto {
  @IsInt()
  @IsPositive()
  stepId: number;

  @IsInt()
  @Min(0)
  priorityOrder: number;
}

export class UpdateRoadmapDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStepProgressDto)
  progress?: UpdateStepProgressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePriorityDto)
  priority?: UpdatePriorityDto;
}