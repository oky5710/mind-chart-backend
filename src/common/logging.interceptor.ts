import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

type RequestWithUser = Request & { user?: { id: string } }

// 성공 응답만 여기서 찍는다 — 에러 응답(4xx/5xx)은 AllExceptionsFilter가 상태 코드별로
// warn/error를 구분해 남기므로, 여기서도 같이 찍으면 같은 요청이 두 번 로그에 남는다.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const response = context.switchToHttp().getResponse<Response>()
    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - start
        const userPart = request.user ? ` user=${request.user.id}` : ''
        this.logger.log(`${request.method} ${request.originalUrl} ${response.statusCode} ${durationMs}ms${userPart}`)
      }),
    )
  }
}
