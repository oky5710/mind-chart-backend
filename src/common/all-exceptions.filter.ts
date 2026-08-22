import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'

type RequestWithUser = Request & { user?: { id: string } }

// 검증 실패(ValidationPipe → 400), 인증 실패(JwtAuthGuard → 401), 소유권 없음(findOwnedOrThrow →
// 404) 모두 지금까지는 클라이언트에 응답만 나가고 서버 어디에도 남지 않았다 — 이 필터가 모든
// 예외를 가로채 상태 코드별로 로그를 남긴 뒤, 기존 NestJS 기본 에러 응답 형식은 그대로 유지한다.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsFilter')

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<RequestWithUser>()

    const status: number =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const body: object | string =
      exception instanceof HttpException
        ? exception.getResponse()
        : { statusCode: status, message: 'Internal server error' }

    const userPart = request.user ? ` user=${request.user.id}` : ''
    const message = exception instanceof Error ? exception.message : String(exception)
    const line = `${request.method} ${request.originalUrl} ${status} ${message}${userPart}`

    // 4xx는 클라이언트 쪽에서 흔히 생기는 오류(검증 실패, 인증 만료 등)라 warn으로, 5xx는 서버
    // 버그일 가능성이 높아 stack trace까지 남기는 error로 구분한다.
    const isServerError = status >= Number(HttpStatus.INTERNAL_SERVER_ERROR)
    if (isServerError) {
      this.logger.error(line, exception instanceof Error ? exception.stack : undefined)
    } else {
      this.logger.warn(line)
    }

    const payload = typeof body === 'object' ? body : { statusCode: status, message: body }
    response.status(status).json({
      ...payload,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    })
  }
}
