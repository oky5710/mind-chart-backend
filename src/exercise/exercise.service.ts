import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateExerciseDto) {
    const { startedAt, endedAt, ...rest } = dto
    return this.prisma.exercise.create({
      data: {
        ...rest,
        userId,
        date: new Date(dto.date),
        ...(startedAt !== undefined && { startedAt: new Date(startedAt) }),
        ...(endedAt !== undefined && { endedAt: new Date(endedAt) }),
      },
    })
  }

  findAll(userId: string, date?: string) {
    return this.prisma.exercise.findMany({
      where: { userId, ...(date && { date: new Date(date) }) },
      orderBy: { date: 'desc' },
    })
  }

  remove(userId: string, id: string) {
    return this.prisma.exercise.deleteMany({ where: { id, userId } })
  }
}
