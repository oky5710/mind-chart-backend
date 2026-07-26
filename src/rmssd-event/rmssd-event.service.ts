import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateRmssdEventDto } from './dto/create-rmssd-event.dto'
import { findOwnedOrThrow } from '../common/find-owned.util'

@Injectable()
export class RmssdEventService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateRmssdEventDto) {
    return this.prisma.rmssdEvent.create({
      data: {
        userId,
        occurredAt: new Date(dto.occurredAt),
        rmssdValue: dto.rmssdValue,
        direction: dto.direction,
        emotion: dto.emotion,
        note: dto.note,
      },
    })
  }

  findAll(userId: string) {
    return this.prisma.rmssdEvent.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.rmssdEvent.findFirst({ where: { id, userId } })
    return findOwnedOrThrow(record)
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id)
    return this.prisma.rmssdEvent.delete({ where: { id } })
  }
}
