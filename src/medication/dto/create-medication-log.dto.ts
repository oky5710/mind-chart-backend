import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateMedicationLogDto {
  @IsString()
  medicationId: string

  @IsDateString()
  date: string

  @IsOptional()
  @IsNumber()
  dosage?: number

  @IsBoolean()
  taken: boolean

  // 아침/취침 등 어느 시간대 복용인지 (메인 화면 퀵버튼에서 기록)
  @IsOptional()
  @IsString()
  timing?: string

  @IsOptional()
  @IsDateString()
  takenAt?: string
}
