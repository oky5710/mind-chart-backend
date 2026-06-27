import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export enum ChangeType {
  STARTED = 'STARTED',
  STOPPED = 'STOPPED',
  DOSAGE_INCREASED = 'DOSAGE_INCREASED',
  DOSAGE_DECREASED = 'DOSAGE_DECREASED',
}

export class CreateMedicationChangeDto {
  @IsString()
  medicationId: string

  @IsDateString()
  date: string

  @IsEnum(ChangeType)
  changeType: ChangeType

  @IsOptional()
  @IsNumber()
  previousDosage?: number

  @IsOptional()
  @IsNumber()
  newDosage?: number

  @IsOptional()
  @IsString()
  reason?: string
}
