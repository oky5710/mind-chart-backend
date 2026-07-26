import { ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsOptional, Matches, Max, Min, ValidateIf } from 'class-validator'
import { DOSE_TIMINGS, type DoseTiming } from '../../medication/dto/quick-log.dto'

export const REMINDER_REPEAT_TYPES = ['DAILY', 'WEEKLY'] as const
export type ReminderRepeatType = (typeof REMINDER_REPEAT_TYPES)[number]

export class CreateMedicationReminderDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean

  @IsIn(DOSE_TIMINGS)
  timing: DoseTiming

  @IsIn(REMINDER_REPEAT_TYPES)
  repeatType: ReminderRepeatType

  // WEEKLY일 때만 필수 — Foundation의 Calendar.Component.weekday와 동일하게 1(일)~7(토), 여러 요일
  // 가능(클라이언트가 이 값을 그대로 DateComponents.weekday에 넣어 쓰므로 변환 없이 맞춘다).
  @ValidateIf((o) => o.repeatType === 'WEEKLY')
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  weekdays?: number[]

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time: string

  @IsDateString()
  startDate: string

  @IsOptional()
  @IsDateString()
  endDate?: string
}
