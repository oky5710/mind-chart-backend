import { IsArray, ValidateNested } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { UpsertWearableDto } from './upsert-wearable.dto'

function parseIfJsonString(item: unknown) {
  if (typeof item !== 'string') return item
  try {
    return JSON.parse(item)
  } catch {
    return item
  }
}

export class BulkWearableDto {
  // iOS 단축어는 리스트 항목이 1개면 배열로 안 감싸거나, 사전을 JSON 문자열로
  // 직렬화해서 보내는 경우가 있어 양쪽 다 보정함
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]).map(parseIfJsonString))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertWearableDto)
  data: UpsertWearableDto[]
}
