import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateEventDto } from './dto/create-event.dto'
import { findOwnedOrThrow } from '../common/find-owned.util'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: { ...dto, userId, date: new Date(dto.date) },
    })
  }

  findAll(userId: string, date?: string) {
    let dateFilter = {}
    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      dateFilter = { date: { gte: start, lt: end } }
    }
    return this.prisma.event.findMany({
      where: { userId, ...dateFilter },
      orderBy: { date: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.event.findFirst({ where: { id, userId } })
    return findOwnedOrThrow(record)
  }

  async update(userId: string, id: string, dto: Partial<CreateEventDto>) {
    await this.findOne(userId, id)
    const { date, ...rest } = dto
    return this.prisma.event.update({
      where: { id },
      data: { ...rest, ...(date && { date: new Date(date) }) },
    })
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id)
    return this.prisma.event.delete({ where: { id } })
  }
}
