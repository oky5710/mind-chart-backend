import { IsOptional, IsString } from 'class-validator'

export class CreateMedicationDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  itemSeq?: string

  @IsOptional()
  @IsString()
  entpName?: string

  @IsOptional()
  @IsString()
  itemImage?: string

  @IsOptional()
  @IsString()
  drugShape?: string

  @IsOptional()
  @IsString()
  colorClass?: string

  @IsOptional()
  @IsString()
  chart?: string
}
