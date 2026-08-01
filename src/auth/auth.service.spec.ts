import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService Google login', () => {
  it('creates the first-login account as user and returns isNewUser=true', async () => {
    const createdUser = {
      id: 'user-1',
      email: 'new@example.com',
      name: 'New User',
      googleId: 'google-1',
      password: null,
      role: UserRole.user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const prisma = {
      user: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null),
        create: jest.fn().mockResolvedValue(createdUser),
        update: jest.fn(),
      },
    };
    const jwt = { sign: jest.fn().mockReturnValue('access-token') };
    const service = new AuthService(
      prisma as unknown as PrismaService,
      jwt as unknown as JwtService,
    );
    const googleClient = (
      service as unknown as { googleClient: { verifyIdToken: jest.Mock } }
    ).googleClient;
    googleClient.verifyIdToken = jest.fn().mockResolvedValue({
      getPayload: () => ({
        email: createdUser.email,
        sub: createdUser.googleId,
        name: createdUser.name,
      }),
    });

    await expect(service.loginWithGoogle('id-token')).resolves.toEqual({
      accessToken: 'access-token',
      isNewUser: true,
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: createdUser.email,
        googleId: createdUser.googleId,
        name: createdUser.name,
        password: null,
      },
    });
    expect(jwt.sign).toHaveBeenCalledWith({
      sub: createdUser.id,
      email: createdUser.email,
      role: UserRole.user,
    });
  });
});
