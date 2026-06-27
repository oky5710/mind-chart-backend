import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator'

export class CreateMedicationLogDto {
  @IsString()
  medicationId: string

  @IsDateString()
  date: string

  @IsNumber()
  dosage: number

  @IsBoolean()
  taken: boolean
}
