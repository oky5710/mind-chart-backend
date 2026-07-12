import { IsOptional, IsNumber, IsInt, Min, Max, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'

// iOS 단축어가 숫자를 문자열("8.7")로 보내는 경우가 있어 보정
function toNumberIfNumericString({ value }: { value: unknown }) {
  if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return Number(value)
  return value
}

export class UpsertWearableDto {
  @IsNotEmpty()
  date: any

  @Transform(toNumberIfNumericString)
  @IsOptional()
  @IsNumber()
  sleepDuration?: number

  @IsOptional()
  sleepStart?: any

  @IsOptional()
  sleepEnd?: any

  @Transform(toNumberIfNumericString)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  sleepQuality?: number

  @Transform(toNumberIfNumericString)
  @IsOptional()
  @IsNumber()
  heartRate?: number

  @Transform(toNumberIfNumericString)
  @IsOptional()
  @IsNumber()
  heartRateVariability?: number
}
