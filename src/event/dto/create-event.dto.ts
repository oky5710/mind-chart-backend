import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export enum EventType {
  MEDICATION_CHANGE = 'MEDICATION_CHANGE',
  RELATIONSHIP_ISSUE = 'RELATIONSHIP_ISSUE',
  WORK_STRESS = 'WORK_STRESS',
  OTHER = 'OTHER',
}

export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
}

export class CreateEventDto {
  @IsDateString()
  date: string

  @IsEnum(EventType)
  type: EventType

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(Sentiment)
  sentiment?: Sentiment

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  intensity?: number
}
