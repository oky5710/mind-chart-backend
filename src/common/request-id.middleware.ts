import { Injectable, NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import { randomUUID } from 'node:crypto'
import type { RequestContext } from './request-context'

const REQUEST_ID_HEADER = 'x-request-id'

// 요청 하나가 컨트롤러/서비스/로그를 거치는 동안 같은 ID로 묶여야 "몇 시쯤 오류났어요" 같은
// 제보를 실제 요청 흐름으로 추적할 수 있다. 업스트림(프록시 등)이 이미 요청 ID를 붙여 보냈으면
// 그대로 이어받고, 없으면 여기서 새로 만들어 응답 헤더로도 돌려준다.
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.headers[REQUEST_ID_HEADER]
    const requestId = typeof incoming === 'string' && incoming.length > 0 ? incoming : randomUUID()
    ;(req as RequestContext).requestId = requestId
    res.setHeader('X-Request-Id', requestId)
    next()
  }
}
