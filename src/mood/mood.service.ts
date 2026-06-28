import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMoodLogDto } from './dto/create-mood-log.dto'

@Injectable()
export class MoodService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMoodLogDto) {
    return this.prisma.moodLog.create({
      data: { ...dto, date: new Date(dto.date) },
    })
  }

  findAll(date?: string) {
    return this.prisma.moodLog.findMany({
      where: { ...(date && { date: new Date(date) }) },
      orderBy: { date: 'desc' },
    })
  }

  remove(id: string) {
    return this.prisma.moodLog.delete({ where: { id } })
  }
}
