import { Injectable } from '@nestjs/common'
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

  remove(userId: string, id: string) {
    return this.prisma.moodLog.deleteMany({ where: { id, userId } })
  }
}
