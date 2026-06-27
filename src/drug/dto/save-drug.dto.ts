import { IsOptional, IsString } from 'class-validator'

export class SaveDrugDto {
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
  efcyQesitm?: string

  @IsOptional()
  @IsString()
  useMethodQesitm?: string

  @IsOptional()
  @IsString()
  atpnWarnQesitm?: string

  @IsOptional()
  @IsString()
  atpnQesitm?: string

  @IsOptional()
  @IsString()
  intrcQesitm?: string

  @IsOptional()
  @IsString()
  seQesitm?: string

  @IsOptional()
  @IsString()
  depositMethodQesitm?: string

  @IsOptional()
  @IsString()
  itemImage?: string
}
