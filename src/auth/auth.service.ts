import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// 30일 안에 한 번이라도 앱을 열면 refresh가 매번 새 30일짜리 토큰으로 교체(rotation)하므로,
// 실제로는 "30일 이상 완전히 앱을 안 켰을 때만" 재로그인이 필요해진다.
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

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

    return this.issueTokens(user.id, user.email, user.role);
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

    return this.issueTokens(user.id, user.email, user.role);
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

    return { ...(await this.issueTokens(user.id, user.email, user.role)), isNewUser };
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

    return { ...(await this.issueTokens(user.id, user.email, user.role)), isNewUser };
  }

  private signAccessToken(userId: string, email: string, role: UserRole): string {
    return this.jwt.sign({ sub: userId, email, role });
  }

  // 액세스 토큰(짧은 수명, JWT)과 refresh 토큰(긴 수명, DB에 해시로만 저장하는 랜덤 문자열)을
  // 함께 발급한다. refresh 토큰은 JWT로 만들지 않는다 — DB 조회 없이는 검증도 무효화도 못 하는
  // 게 오히려 목적에 맞다(탈취돼도 즉시 revoke 가능해야 한다).
  private async issueTokens(userId: string, email: string, role: UserRole) {
    const accessToken = this.signAccessToken(userId, email, role);
    const refreshToken = randomBytes(32).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });
    return { accessToken, refreshToken };
  }

  // refresh 토큰을 한 번 쓸 때마다 폐기하고 새로 발급한다(rotation) — 탈취된 토큰이 재사용되면
  // 이미 revoke된 행을 다시 쓰려는 시도가 되어 다음 조회에서 곧바로 걸린다.
  async refresh(rawToken: string) {
    const tokenHash = hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('세션이 만료되었습니다. 다시 로그인해주세요');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(stored.user.id, stored.user.email, stored.user.role);
  }

  // 로그아웃 시 클라이언트가 들고 있던 refresh 토큰을 서버에서도 무효화한다 — 안 지우면 로그아웃
  // 후에도 그 refresh 토큰으로 액세스 토큰을 계속 재발급받을 수 있다. 이미 없거나 만료된
  // 토큰이어도 로그아웃 자체는 성공으로 처리한다(클라이언트 입장에서 결과는 같다).
  async revokeRefreshToken(rawToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
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
