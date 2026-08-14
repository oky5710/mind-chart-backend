import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('이미 사용 중인 이메일입니다');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, name: dto.name },
    });

    return this.sign(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.password)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid)
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');

    return this.sign(user.id, user.email, user.role);
  }

  async loginWithGoogle(idToken: string) {
    let payload: { email?: string; sub: string; name?: string } | undefined;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('구글 인증에 실패했습니다');
    }
    if (!payload?.email || !payload.sub) {
      throw new UnauthorizedException('구글 인증에 실패했습니다');
    }

    const { email, sub: googleId, name } = payload;

    let user = await this.prisma.user.findUnique({ where: { googleId } });
    let isNewUser = false;
    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
    }
    if (!user) {
      user = await this.prisma.user.create({
        data: { email, googleId, name: name ?? email, password: null },
      });
      isNewUser = true;
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }

    return { ...this.sign(user.id, user.email, user.role), isNewUser };
  }

  async loginWithApple(idToken: string, fullName?: string) {
    let payload: { email?: string; sub: string } | undefined;
    try {
      payload = await appleSignin.verifyIdToken(idToken, {
        audience: process.env.APPLE_CLIENT_ID,
      });
    } catch {
      throw new UnauthorizedException('애플 인증에 실패했습니다');
    }
    if (!payload?.sub) {
      throw new UnauthorizedException('애플 인증에 실패했습니다');
    }

    const { email, sub: appleId } = payload;

    let user = await this.prisma.user.findUnique({ where: { appleId } });
    let isNewUser = false;
    if (!user && email) {
      user = await this.prisma.user.findUnique({ where: { email } });
    }
    if (!user) {
      // Apple이 이메일 공유를 비공개로 설정한 사용자에게는 email을 안 줄 수 있어, 그 경우엔
      // 릴레이 주소 대신 항상 유일한 appleId 기반 자리표시 이메일을 만든다.
      const placeholderEmail = email ?? `${appleId}@appleid.mindprofiler`;
      user = await this.prisma.user.create({
        data: {
          email: placeholderEmail,
          appleId,
          name: fullName ?? placeholderEmail,
          password: null,
        },
      });
      isNewUser = true;
    } else if (!user.appleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { appleId },
      });
    }

    return { ...this.sign(user.id, user.email, user.role), isNewUser };
  }

  private sign(userId: string, email: string, role: UserRole) {
    const token = this.jwt.sign({ sub: userId, email, role });
    return { accessToken: token };
  }

  // User의 모든 연관 레코드(이벤트/약 기록/기분/커피/운동/rMSSD 이벤트 등)는 스키마에서 이미
  // onDelete: Cascade로 걸려 있어, user 행 하나만 지우면 DB가 나머지를 전부 같이 지운다.
  // password 해시가 응답에 실리지 않도록 select로 최소 필드만 돌려준다.
  async deleteAccount(userId: string) {
    const user = await this.prisma.user.delete({
      where: { id: userId },
      select: { id: true },
    });
    return user;
  }
}
