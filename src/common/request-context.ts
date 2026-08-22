import type { Request } from 'express'

// 미들웨어가 채워주는 requestId와 JwtStrategy가 채워주는 user — 둘 다 원본 Express Request에는
// 없는 필드라, 인터셉터/필터에서 같은 타입으로 참조하려고 하나로 모아둔다.
export type RequestContext = Request & {
  requestId: string
  user?: { id: string }
}
