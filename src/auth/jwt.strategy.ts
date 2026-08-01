import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: { sub: string; email: string; role?: UserRole }) {
    // 역할 추가 전에 발급된 JWT도 만료 전까지 사용할 수 있게 기본 user로 취급한다.
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role ?? UserRole.user,
    };
  }
}
