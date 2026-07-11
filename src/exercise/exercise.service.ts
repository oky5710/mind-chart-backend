import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateExerciseDto) {
    const { startedAt, endedAt, ...rest } = dto
    return this.prisma.exercise.create({
      data: {
        ...rest,
        date: new Date(dto.date),
        ...(startedAt !== undefined && { startedAt: new Date(startedAt) }),
        ...(endedAt !== undefined && { endedAt: new Date(endedAt) }),
      },
    })
  }

  findAll(date?: string) {
    return this.prisma.exercise.findMany({
      where: { ...(date && { date: new Date(date) }) },
      orderBy: { date: 'desc' },
    })
  }

  remove(id: string) {
    return this.prisma.exercise.delete({ where: { id } })
  }
}
