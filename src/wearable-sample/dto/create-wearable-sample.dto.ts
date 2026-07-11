import { IsIn, IsISO8601, IsNumber } from 'class-validator'

export const WEARABLE_SAMPLE_TYPES = ['heartRate', 'heartRateVariability'] as const
export type WearableSampleType = (typeof WEARABLE_SAMPLE_TYPES)[number]

export class CreateWearableSampleDto {
  @IsIn(WEARABLE_SAMPLE_TYPES)
  type: WearableSampleType

  @IsISO8601()
  timestamp: string

  @IsNumber()
  value: number
}
