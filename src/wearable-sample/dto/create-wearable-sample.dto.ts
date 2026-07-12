import { IsIn, IsISO8601, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export const WEARABLE_SAMPLE_TYPES = ['heartRate', 'heartRateVariability'] as const
export type WearableSampleType = (typeof WEARABLE_SAMPLE_TYPES)[number]

export class CreateWearableSampleDto {
  @IsIn(WEARABLE_SAMPLE_TYPES)
  type: WearableSampleType

  @IsISO8601()
  timestamp: string

  // iOS 단축어가 숫자를 문자열("8.7")로 보내는 경우가 있어 보정
  @Transform(({ value }) => (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)) ? Number(value) : value))
  @IsNumber()
  value: number
}
