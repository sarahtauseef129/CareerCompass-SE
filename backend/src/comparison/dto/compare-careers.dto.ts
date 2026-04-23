import { IsArray, IsInt, IsPositive, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CompareCareersDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  careerIds: number[];
}