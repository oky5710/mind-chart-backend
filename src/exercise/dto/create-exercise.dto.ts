import { IsString, IsInt, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator'

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

  // 단축어 자동화에서 강도를 직접 못 줄 때, 이 값(분당 소모 칼로리 계산용)으로 강도를 추정함
  @IsOptional()
  @IsNumber()
  caloriesBurned?: number
}
