import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateHrvDto } from './dto/create-hrv.dto'

@Injectable()
export class HrvService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateHrvDto) {
    return this.prisma.hrvAnalysis.create({
      data: { ...dto, userId, examinedAt: new Date(dto.examinedAt) },
    })
  }

  findAll(userId: string) {
    return this.prisma.hrvAnalysis.findMany({
      where: { userId },
      orderBy: { examinedAt: 'desc' },
    })
  }

  async findOne(userId: string, id: number) {
    const record = await this.prisma.hrvAnalysis.findFirst({ where: { id, userId } })
    if (!record) throw new NotFoundException()
    return record
  }

  async update(userId: string, id: number, dto: Partial<CreateHrvDto>) {
    await this.findOne(userId, id)
    const { examinedAt, ...rest } = dto
    return this.prisma.hrvAnalysis.update({
      where: { id },
      data: { ...rest, ...(examinedAt && { examinedAt: new Date(examinedAt) }) },
    })
  }

  async remove(userId: string, id: number) {
    await this.findOne(userId, id)
    return this.prisma.hrvAnalysis.delete({ where: { id } })
  }
}
