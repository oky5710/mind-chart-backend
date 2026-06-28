import { IsOptional, IsString, IsArray } from 'class-validator'

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  timings?: string[]
}
