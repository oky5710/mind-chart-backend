import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'
import { logJson, type LogLevel } from './logger'
import type { RequestContext } from './request-context'

// 검증 실패(ValidationPipe → 400), 인증 실패(JwtAuthGuard → 401/403), 소유권 없음
// (findOwnedOrThrow → 404) 모두 지금까지는 클라이언트에 응답만 나가고 서버 어디에도 남지 않았다.
// 이 필터가 모든 예외를 가로채 상태 코드별로 레벨을 구분해 로그를 남긴 뒤, 기존 NestJS 기본
// 에러 응답 형식(statusCode/message)은 그대로 유지한다.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<RequestContext>()

    const status: number =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const body: object | string =
      exception instanceof HttpException
        ? exception.getResponse()
        : { statusCode: status, message: 'Internal server error' }

    const message = exception instanceof Error ? exception.message : String(exception)
    const isServerError = status >= Number(HttpStatus.INTERNAL_SERVER_ERROR)

    logJson(logLevelFor(status), {
      context: 'HTTP',
      method: request.method,
      path: request.originalUrl,
      statusCode: status,
      userId: request.user?.id ?? null,
      requestId: request.requestId,
      message,
      // stack trace는 서버 버그를 좇을 때만 필요하다 — 흔히 발생하는 4xx까지 매번 붙이면
      // 로그가 불필요하게 커진다.
      ...(isServerError && exception instanceof Error ? { stack: exception.stack } : {}),
    })

    const payload = typeof body === 'object' ? body : { statusCode: status, message: body }
    response.status(status).json({
      ...payload,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    })
  }
}

// 서비스가 커지면 401/404 같은 흔한 4xx가 쏟아져 진짜 이상 신호(5xx, 인증 우회 시도, 요청
// 폭주)를 덮어버린다 — 정상적인 흐름에 가까운 404는 info로 낮추고, 검증 실패·인증 실패·중복·
// 폭주는 warn으로, 예상 못 한 서버 에러만 error로 남긴다.
function logLevelFor(status: number): LogLevel {
  if (status >= Number(HttpStatus.INTERNAL_SERVER_ERROR)) return 'error'
  if (status === Number(HttpStatus.NOT_FOUND)) return 'info'
  return 'warn'
}
