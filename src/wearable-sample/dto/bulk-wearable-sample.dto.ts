import { IsArray, ValidateNested } from 'class-validator'
import { Transform, plainToInstance } from 'class-transformer'
import { CreateWearableSampleDto } from './create-wearable-sample.dto'

function parseIfJsonString(item: unknown) {
  if (typeof item !== 'string') return item
  try {
    return JSON.parse(item)
  } catch {
    return item
  }
}

export class BulkWearableSampleDto {
  // iOS 단축어는 리스트 항목이 1개면 배열로 안 감싸거나, 사전을 JSON 문자열로
  // 직렬화해서 보내는 경우가 있어 양쪽 다 보정함. @Type을 따로 쓰면 이 Transform
  // 결과를 덮어써버려서(원본 문자열 기준으로 다시 변환) 여기서 직접 클래스로 변환함
  @Transform(({ value }) =>
    (Array.isArray(value) ? value : [value]).map((item) =>
      plainToInstance(CreateWearableSampleDto, parseIfJsonString(item)),
    ),
  )
  @IsArray()
  @ValidateNested({ each: true })
  data: CreateWearableSampleDto[]
}
