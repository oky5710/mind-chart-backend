import { IsIn } from 'class-validator'

export const DOSE_TIMINGS = ['MORNING', 'LUNCH', 'DINNER', 'BEDTIME', 'AS_NEEDED'] as const
export type DoseTiming = (typeof DOSE_TIMINGS)[number]

export class QuickLogDto {
  @IsIn(DOSE_TIMINGS)
  timing: DoseTiming
}
