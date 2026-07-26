import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from 'class-validator'

export const RMSSD_DIRECTIONS = ['LOW', 'HIGH'] as const
export type RmssdDirection = (typeof RMSSD_DIRECTIONS)[number]

export const RMSSD_EMOTIONS = ['ANXIETY', 'STRESS', 'IRRITATION', 'SADNESS', 'FATIGUE', 'CALM', 'JOY'] as const
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
