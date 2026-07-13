import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { WEARABLE_SAMPLE_TYPES } from './dto/create-wearable-sample.dto'

@Injectable()
export class WearableSampleService {
  constructor(private readonly prisma: PrismaService) {}

  // 컨트롤러에서 클래스 검증(class-validator) 없이 원시 객체를 그대로 받으므로,
  // 여기서 직접 타입/숫자 변환 및 유효성 확인을 함(단축어가 숫자를 문자열로 보내는 경우 포함)
  async createBulk(userId: string, samples: Array<Record<string, unknown>>) {
    const valid = samples
      .map((s) => {
        const type = typeof s.type === 'string' ? s.type : undefined
        const timestamp = typeof s.timestamp === 'string' ? s.timestamp : undefined
        const rawValue = s.value
        const value = typeof rawValue === 'number' ? rawValue : typeof rawValue === 'string' ? Number(rawValue) : NaN
        return { type, timestamp, value }
      })
      .filter(
        (s): s is { type: string; timestamp: string; value: number } =>
          !!s.type &&
          (WEARABLE_SAMPLE_TYPES as readonly string[]).includes(s.type) &&
          !!s.timestamp &&
          !isNaN(new Date(s.timestamp).getTime()) &&
          !isNaN(s.value),
      )

    const result = await this.prisma.wearableSample.createMany({
      data: valid.map((s) => ({
        userId,
        type: s.type,
        timestamp: new Date(s.timestamp),
        value: s.value,
      })),
      skipDuplicates: true,
    })
    return { created: result.count, skipped: samples.length - valid.length }
  }

  findAll(userId: string, type: string, from?: string, to?: string) {
    return this.prisma.wearableSample.findMany({
      where: {
        userId,
        type,
        ...((from || to) && {
          timestamp: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }),
      },
      orderBy: { timestamp: 'asc' },
    })
  }
}
