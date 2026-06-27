import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateEventDto } from './dto/create-event.dto'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: { ...dto, date: new Date(dto.date) },
    })
  }

  findAll(date?: string) {
    return this.prisma.event.findMany({
      where: { ...(date && { date: new Date(date) }) },
      orderBy: { date: 'desc' },
    })
  }

  async findOne(id: string) {
    const record = await this.prisma.event.findUnique({ where: { id } })
    if (!record) throw new NotFoundException()
    return record
  }

  async update(id: string, dto: Partial<CreateEventDto>) {
    await this.findOne(id)
    const { date, ...rest } = dto
    return this.prisma.event.update({
      where: { id },
      data: { ...rest, ...(date && { date: new Date(date) }) },
    })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.event.delete({ where: { id } })
  }
}
