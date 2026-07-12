import { IsString, IsInt, IsNumber, IsOptional, Min, Max } from 'class-validator'

export class CreateExerciseDto {
  @IsString()
  date: string

  @IsString()
  type: string

  @IsInt()
  @Min(1)
  durationMinutes: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  intensity?: number

  // 단축어 자동화에서 강도를 직접 못 줄 때, 이 값(분당 소모 칼로리 계산용)으로 강도를 추정함
  @IsOptional()
  @IsNumber()
  caloriesBurned?: number

  @IsOptional()
  startedAt?: any

  @IsOptional()
  endedAt?: any
}
