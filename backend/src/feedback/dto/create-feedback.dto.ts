import { IsInt, IsString, Min, Max, MinLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @MinLength(5)
  message: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}