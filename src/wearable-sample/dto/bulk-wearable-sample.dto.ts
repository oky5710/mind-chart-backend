import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateWearableSampleDto } from './create-wearable-sample.dto'

export class BulkWearableSampleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWearableSampleDto)
  data: CreateWearableSampleDto[]
}
