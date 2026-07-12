import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('이미 사용 중인 이메일입니다')

    const hashed = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, name: dto.name },
    })

    return this.sign(user.id, user.email)
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user || !user.password) throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다')

    return this.sign(user.id, user.email)
  }

  async loginWithGoogle(idToken: string) {
    let payload: { email?: string; sub: string; name?: string } | undefined
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      payload = ticket.getPayload()
    } catch {
      throw new UnauthorizedException('구글 인증에 실패했습니다')
    }
    if (!payload?.email || !payload.sub) {
      throw new UnauthorizedException('구글 인증에 실패했습니다')
    }

    const { email, sub: googleId, name } = payload

    let user = await this.prisma.user.findUnique({ where: { googleId } })
    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } })
    }
    if (!user) {
      user = await this.prisma.user.create({
        data: { email, googleId, name: name ?? email, password: null },
      })
    } else if (!user.googleId) {
      user = await this.prisma.user.update({ where: { id: user.id }, data: { googleId } })
    }

    return this.sign(user.id, user.email)
  }

  private sign(userId: string, email: string) {
    const token = this.jwt.sign({ sub: userId, email })
    return { accessToken: token }
  }

  // iOS 단축어 등 자동화용 — 7일 만료되는 로그인 토큰과 별개로, 매번 재로그인 없이 계속 쓸 수 있는 토큰
  issueDeviceToken(userId: string, email: string) {
    const token = this.jwt.sign({ sub: userId, email }, { expiresIn: '10y' })
    return { accessToken: token }
  }
}
