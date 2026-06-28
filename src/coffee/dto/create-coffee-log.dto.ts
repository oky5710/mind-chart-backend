import { IsString, IsOptional, IsInt, Min } from 'class-validator'

export class CreateCoffeeLogDto {
  @IsString()
  date: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  shots?: number

  @IsOptional()
  @IsString()
  memo?: string
}
