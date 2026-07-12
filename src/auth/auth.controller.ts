import { Controller, Post, Get, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { GoogleLoginDto } from './dto/google-login.dto'
import { Public } from './public.decorator'
import { CurrentUser } from './current-user.decorator'
import type { CurrentUserPayload } from './current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto)
  }

  @Public()
  @Post('google')
  loginWithGoogle(@Body() dto: GoogleLoginDto) {
    return this.auth.loginWithGoogle(dto.idToken)
  }

  // 로그인된 상태(짧은 유효기간 토큰)에서만 발급 가능 — 단축어 등 자동화에 넣을 장기 토큰
  @Get('device-token')
  issueDeviceToken(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.issueDeviceToken(user.id, user.email)
  }
}
