import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './common/logging.interceptor'
import { AllExceptionsFilter } from './common/all-exceptions.filter'

async function bootstrap() {
  // 운영에서는 매 요청마다 찍히는 debug/verbose까지 남기면 정작 중요한 warn/error가 묻힌다.
  const isProduction = process.env.NODE_ENV === 'production'
  const app = await NestFactory.create(AppModule, {
    logger: isProduction ? ['log', 'warn', 'error'] : ['log', 'warn', 'error', 'debug', 'verbose'],
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.enableCors()
  const port = process.env.PORT ? Number(process.env.PORT) : 3001
  await app.listen(port)
  console.log(`서버 실행 중: http://localhost:${port}`)
}
bootstrap()
