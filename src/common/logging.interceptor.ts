import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import type { Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { logJson } from './logger'
import type { RequestContext } from './request-context'

// 성공 응답만 여기서 찍는다 — 에러 응답(4xx/5xx)은 AllExceptionsFilter가 상태 코드별로 레벨을
// 구분해 남기므로, 여기서도 같이 찍으면 같은 요청이 두 번 로그에 남는다.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestContext>()
    const response = context.switchToHttp().getResponse<Response>()
    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        logJson('info', {
          context: 'HTTP',
          method: request.method,
          path: request.originalUrl,
          statusCode: response.statusCode,
          durationMs: Date.now() - start,
          userId: request.user?.id ?? null,
          requestId: request.requestId,
        })
      }),
    )
  }
}
