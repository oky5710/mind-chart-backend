import { IsString, IsInt, Min, Max } from 'class-validator'

export class CreateMoodLogDto {
  @IsString()
  date: string

  @IsInt()
  @Min(1)
  @Max(5)
  score: number
}
