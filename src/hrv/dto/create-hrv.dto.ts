import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from 'class-validator'

export const HRV_MEASUREMENT_METHODS = ['PPG', 'ECG'] as const
export type HrvMeasurementMethod = (typeof HRV_MEASUREMENT_METHODS)[number]

export class CreateHrvDto {
  @IsDateString()
  examinedAt: string

  @IsOptional()
  @IsString()
  hospital?: string

  @IsOptional()
  @IsString()
  memo?: string

  @IsIn(HRV_MEASUREMENT_METHODS)
  method: HrvMeasurementMethod

  // 두 측정 방식이 공유하는 값
  @IsNumber()
  mhr: number

  @IsNumber()
  sdnn: number

  @IsNumber()
  tp: number

  @IsNumber()
  lf: number

  @IsNumber()
  hf: number

  @IsNumber()
  lfNorm: number

  @IsNumber()
  hfNorm: number

  // ECG 전용 (Time/Frequency Domain 상세, Other)
  @IsOptional()
  @IsNumber()
  rmssd?: number

  @IsOptional()
  @IsNumber()
  psi?: number

  @IsOptional()
  @IsNumber()
  vlf?: number

  @IsOptional()
  @IsNumber()
  lfHfRatio?: number

  @IsOptional()
  @IsNumber()
  ectopicBeat?: number

  @IsOptional()
  @IsNumber()
  srd?: number

  @IsOptional()
  @IsString()
  result?: string

  // PPG 전용
  @IsOptional()
  @IsNumber()
  hrvIndex?: number
}
