import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { findOwnedOrThrow } from '../common/find-owned.util'

// 단축어 자동화는 강도(주관적 값)를 알 수 없어, 분당 소모 칼로리로 대략 추정함
// (걷기 ~3-4kcal/분, 중강도 유산소 ~7-8, 달리기 ~10-12, 고강도 인터벌 12+ 기준의 근사치)
function estimateIntensity(caloriesBurned: number, durationMinutes: number): number {
  const kcalPerMin = caloriesBurned / durationMinutes
  if (kcalPerMin < 4) return 1
  if (kcalPerMin < 6) return 2
  if (kcalPerMin < 9) return 3
  if (kcalPerMin < 12) return 4
  return 5
}

function durationMinutesBetween(startedAt: string, endedAt: string): number {
  return Math.max(1, Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60000))
}

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateExerciseDto) {
    const { caloriesBurned, ...rest } = dto
    const durationMinutes = durationMinutesBetween(dto.startedAt, dto.endedAt)
    const intensity = rest.intensity ?? (caloriesBurned !== undefined ? estimateIntensity(caloriesBurned, durationMinutes) : undefined)
    return this.prisma.exercise.create({
      data: {
        type: rest.type,
        intensity,
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
    const { caloriesBurned, ...rest } = dto
    return this.prisma.exercise.update({
      where: { id },
      data: {
        ...rest,
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
