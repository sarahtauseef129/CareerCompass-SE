import { IsInt, IsPositive } from 'class-validator';

export class CreateBookmarkDto {
  @IsInt()
  @IsPositive()
  careerId: number;
}