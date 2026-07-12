import { IsArray, ValidateNested } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { UpsertWearableDto } from './upsert-wearable.dto'

export class BulkWearableDto {
  // iOS 단축어는 리스트에 항목이 1개뿐이면 배열로 감싸지 않고 객체 하나만 보내는 경우가 있어 보정함
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertWearableDto)
  data: UpsertWearableDto[]
}
