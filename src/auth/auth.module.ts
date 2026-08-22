import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    PassportModule,
    // 액세스 토큰은 짧게 살고(만료돼도 refresh로 조용히 재발급), 실제 로그인 유지 기간은
    // refresh 토큰(AuthService의 REFRESH_TOKEN_TTL_MS, 30일 rotation)이 담당한다.
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  controllers: [AuthController],
})
export class AuthModule {}
