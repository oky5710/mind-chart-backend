import { IsOptional, IsNumber, IsInt, Min, Max, IsNotEmpty } from 'class-validator'

export class UpsertWearableDto {
  @IsNotEmpty()
  date: any

  @IsOptional()
  @IsNumber()
  sleepDuration?: number

  @IsOptional()
  sleepStart?: any

  @IsOptional()
  sleepEnd?: any

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  sleepQuality?: number

  @IsOptional()
  @IsNumber()
  heartRate?: number

  @IsOptional()
  @IsNumber()
  heartRateVariability?: number
}
