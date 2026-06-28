import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { UpsertWearableDto } from './upsert-wearable.dto'

export class BulkWearableDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertWearableDto)
  data: UpsertWearableDto[]
}
