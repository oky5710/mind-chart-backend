import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateHrvDto } from './dto/create-hrv.dto'

@Injectable()
export class HrvService {
  constructor(private readonly prisma: PrismaService) {}

  private async getDefaultUserId(): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email: 'test@test.com' } })
    if (!user) throw new NotFoundException('기본 사용자가 없습니다. seed를 실행해주세요.')
    return user.id
  }

  async create(dto: CreateHrvDto) {
    const userId = await this.getDefaultUserId()
    return this.prisma.hrvAnalysis.create({
      data: { ...dto, userId, examinedAt: new Date(dto.examinedAt) },
    })
  }

  findAll() {
    return this.prisma.hrvAnalysis.findMany({
      orderBy: { examinedAt: 'desc' },
    })
  }

  async findOne(id: number) {
    const record = await this.prisma.hrvAnalysis.findUnique({ where: { id } })
    if (!record) throw new NotFoundException()
    return record
  }

  async update(id: number, dto: Partial<CreateHrvDto>) {
    await this.findOne(id)
    const { examinedAt, ...rest } = dto
    return this.prisma.hrvAnalysis.update({
      where: { id },
      data: { ...rest, ...(examinedAt && { examinedAt: new Date(examinedAt) }) },
    })
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.hrvAnalysis.delete({ where: { id } })
  }
}
