import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from 'class-validator'

export const RMSSD_DIRECTIONS = ['LOW', 'HIGH'] as const
export type RmssdDirection = (typeof RMSSD_DIRECTIONS)[number]

export const RMSSD_EMOTIONS = [
  // 긍정
  'JOY',
  'CALM',
  'CONFIDENCE',
  'EXCITEMENT',
  'LOVE',
  'GRATITUDE',
  'SATISFACTION',
  'THRILL',
  // 부정
  'ANXIETY',
  'DEPRESSION',
  'ANGER',
  'STRESS',
  'FRUSTRATION',
  'SADNESS',
  'FATIGUE',
  'FEAR',
] as const
export type RmssdEmotion = (typeof RMSSD_EMOTIONS)[number]

export class CreateRmssdEventDto {
  @IsDateString()
  occurredAt: string

  @IsNumber()
  rmssdValue: number

  @IsIn(RMSSD_DIRECTIONS)
  direction: RmssdDirection

  @IsIn(RMSSD_EMOTIONS)
  emotion: RmssdEmotion

  @IsOptional()
  @IsString()
  note?: string
}
