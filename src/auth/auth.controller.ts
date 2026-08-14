import { Controller, Post, Delete, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AppleLoginDto } from './dto/apple-login.dto';
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

  // 로그인 상태(글로벌 JwtAuthGuard)만 있으면 되고 role은 안 가리므로, 관리자 전용
  // UserController(/users)가 아니라 여기 둔다 — 자기 자신 계정만 지울 수 있다.
  @Delete('me')
  deleteMe(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.deleteAccount(user.id);
  }
}
