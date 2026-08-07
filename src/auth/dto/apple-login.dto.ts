import { IsOptional, IsString } from 'class-validator'

export class AppleLoginDto {
  @IsString()
  idToken: string

  // Apple은 최초 인가 시 한 번만 전체 이름을 내려주므로, 클라이언트가 그 순간에만 값을 보낸다.
  @IsOptional()
  @IsString()
  fullName?: string
}
