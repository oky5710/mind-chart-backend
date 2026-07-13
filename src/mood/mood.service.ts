import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMoodLogDto } from './dto/create-mood-log.dto'

@Injectable()
export class MoodService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateMoodLogDto) {
    return this.prisma.moodLog.create({
      data: { ...dto, userId, date: new Date(dto.date) },
    })
  }

  findAll(userId: string, date?: string) {
    return this.prisma.moodLog.findMany({
      where: { userId, ...(date && { date: new Date(date) }) },
      orderBy: { date: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.moodLog.findFirst({ where: { id, userId } })
    if (!record) throw new NotFoundException()
    return record
  }

  async update(userId: string, id: string, dto: Partial<CreateMoodLogDto>) {
    await this.findOne(userId, id)
    return this.prisma.moodLog.update({
      where: { id },
      data: { ...dto, ...(dto.date && { date: new Date(dto.date) }) },
    })
  }

  remove(userId: string, id: string) {
    return this.prisma.moodLog.deleteMany({ where: { id, userId } })
  }
}
