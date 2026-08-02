import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { findOwnedOrThrow } from '../common/find-owned.util'

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        type: dto.type,
        intensity: dto.intensity,
        userId,
        startedAt: new Date(dto.startedAt),
        endedAt: new Date(dto.endedAt),
      },
    })
  }

  findAll(userId: string, date?: string) {
    return this.prisma.exercise.findMany({
      where: {
        userId,
        ...(date && {
          startedAt: {
            gte: new Date(`${date}T00:00:00`),
            lt: new Date(new Date(`${date}T00:00:00`).getTime() + 24 * 60 * 60 * 1000),
          },
        }),
      },
      orderBy: { startedAt: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.exercise.findFirst({ where: { id, userId } })
    return findOwnedOrThrow(record)
  }

  async update(userId: string, id: string, dto: Partial<CreateExerciseDto>) {
    await this.findOne(userId, id)
    return this.prisma.exercise.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startedAt && { startedAt: new Date(dto.startedAt) }),
        ...(dto.endedAt && { endedAt: new Date(dto.endedAt) }),
      },
    })
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id)
    return this.prisma.exercise.delete({ where: { id } })
  }
}
