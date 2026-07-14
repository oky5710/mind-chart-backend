import { IsDateString, IsIn } from 'class-validator'

export const DOSE_TIMINGS = ['MORNING', 'LUNCH', 'DINNER', 'BEDTIME', 'AS_NEEDED'] as const
export type DoseTiming = (typeof DOSE_TIMINGS)[number]

export class QuickLogDto {
  @IsIn(DOSE_TIMINGS)
  timing: DoseTiming

  // 서버(UTC) 기준 "오늘"과 사용자의 로컬 날짜가 자정 근처에 어긋날 수 있어,
  // 프론트에서 로컬 날짜(YYYY-MM-DD)를 직접 받음
  @IsDateString()
  date: string
}
