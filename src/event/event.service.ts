import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateEventDto } from './dto/create-event.dto'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: { ...dto, userId, date: new Date(dto.date) },
    })
  }

  findAll(userId: string, date?: string) {
    return this.prisma.event.findMany({
      where: { userId, ...(date && { date: new Date(date) }) },
      orderBy: { date: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.event.findFirst({ where: { id, userId } })
    if (!record) throw new NotFoundException()
    return record
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
