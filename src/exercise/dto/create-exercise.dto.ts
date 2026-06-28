import { IsString, IsInt, Min, Max } from 'class-validator'

export class CreateExerciseDto {
  @IsString()
  date: string

  @IsString()
  type: string

  @IsInt()
  @Min(1)
  durationMinutes: number

  @IsInt()
  @Min(1)
  @Max(5)
  intensity: number
}
