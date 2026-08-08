import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AssignableRole } from './dto/update-user-role.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    })
  }

  async updateRole(currentUserId: string, targetUserId: string, role: AssignableRole) {
    if (targetUserId === currentUserId) {
      throw new BadRequestException('자기 자신의 권한은 변경할 수 없습니다.')
    }

    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } })
    if (!target) throw new NotFoundException('사용자를 찾을 수 없습니다.')

    // admin은 이 화면에서 관리 대상이 아니다 — DB에서만 승격/강등한다.
    if (target.role === 'admin') {
      throw new ForbiddenException('admin 권한은 이 화면에서 변경할 수 없습니다.')
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })
  }
}
