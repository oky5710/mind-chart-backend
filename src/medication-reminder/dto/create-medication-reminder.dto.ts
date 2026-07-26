import { ArrayNotEmpty, IsArray, IsDateString, IsIn, IsInt, IsOptional, Matches, Max, Min, ValidateIf } from 'class-validator'
import { DOSE_TIMINGS, type DoseTiming } from '../../medication/dto/quick-log.dto'

export const REMINDER_REPEAT_TYPES = ['DAILY', 'WEEKLY'] as const
export type ReminderRepeatType = (typeof REMINDER_REPEAT_TYPES)[number]

export class CreateMedicationReminderDto {
  @IsIn(DOSE_TIMINGS)
  timing: DoseTiming

  @IsIn(REMINDER_REPEAT_TYPES)
  repeatType: ReminderRepeatType

  // WEEKLY일 때만 필수 — 0(일)~6(토), 여러 요일 가능.
  @ValidateIf((o) => o.repeatType === 'WEEKLY')
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weekdays?: number[]

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time: string

  @IsDateString()
  startDate: string

  @IsOptional()
  @IsDateString()
  endDate?: string
}
