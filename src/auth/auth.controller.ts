import { Controller, Post, Delete, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AppleLoginDto } from './dto/apple-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './public.decorator';
import { CurrentUser } from './current-user.decorator';
import type { CurrentUserPayload } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Public()
  @Post('google')
  loginWithGoogle(@Body() dto: GoogleLoginDto) {
    return this.auth.loginWithGoogle(dto.idToken);
  }

  @Public()
  @Post('apple')
  loginWithApple(@Body() dto: AppleLoginDto) {
    return this.auth.loginWithApple(dto.idToken, dto.fullName);
  }

  // 액세스 토큰이 만료됐을 때 재로그인 없이 조용히 새 토큰 쌍을 받는 엔드포인트라 로그인
  // 전에도 호출할 수 있어야 한다 — 그래서 전역 JwtAuthGuard 대상에서 뺀다(@Public).
  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  // 로그아웃 시점엔 액세스 토큰이 이미 만료돼 있을 수 있어 인증을 요구하지 않는다 — refresh
  // 토큰 자체가 곧 "이걸 무효화해달라"는 증명이다.
  @Public()
  @Post('logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.auth.revokeRefreshToken(dto.refreshToken);
  }

  // 로그인 상태(글로벌 JwtAuthGuard)만 있으면 되고 role은 안 가리므로, 관리자 전용
  // UserController(/users)가 아니라 여기 둔다 — 자기 자신 계정만 지울 수 있다.
  @Delete('me')
  deleteMe(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.deleteAccount(user.id);
  }
}
