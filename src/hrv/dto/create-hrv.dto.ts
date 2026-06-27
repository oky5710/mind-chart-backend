import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateHrvDto {
  @IsDateString()
  examinedAt: string

  @IsOptional()
  @IsString()
  hospital?: string

  @IsOptional()
  @IsString()
  memo?: string

  // Time Domain Analysis
  @IsNumber()
  mhr: number

  @IsNumber()
  sdnn: number

  @IsNumber()
  rmssd: number

  @IsNumber()
  psi: number

  // Frequency Domain Analysis
  @IsNumber()
  tp: number

  @IsNumber()
  vlf: number

  @IsNumber()
  lf: number

  @IsNumber()
  hf: number

  @IsNumber()
  lfNorm: number

  @IsNumber()
  hfNorm: number

  @IsNumber()
  lfHfRatio: number

  @IsNumber()
  ectopicBeat: number

  // Other
  @IsNumber()
  srd: number

  @IsString()
  result: string
}
