import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: { ...dto, date: new Date(dto.date) },
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
