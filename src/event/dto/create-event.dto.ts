import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export enum EventType {
  FRIEND_MEETING = 'FRIEND_MEETING',
  CONCERT = 'CONCERT',
  RELATIONSHIP_STRESS = 'RELATIONSHIP_STRESS',
  CONFLICT = 'CONFLICT',
  EXERCISE = 'EXERCISE',
  HOBBY = 'HOBBY',
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

  @IsEnum(Sentiment)
  sentiment: Sentiment

  @IsInt()
  @Min(1)
  @Max(5)
  intensity: number
}
