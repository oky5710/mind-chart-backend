import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { GoogleLoginDto } from './dto/google-login.dto'
import { Public } from './public.decorator'

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
}
