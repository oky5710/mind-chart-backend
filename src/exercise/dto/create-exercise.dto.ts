import { IsString, IsInt, IsOptional, IsDateString, Min, Max } from 'class-validator'

export class CreateExerciseDto {
  @IsString()
  type: string

  @IsDateString()
  startedAt: string

  @IsDateString()
  endedAt: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  intensity?: number
}
