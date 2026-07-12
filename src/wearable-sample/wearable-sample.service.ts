import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateWearableSampleDto } from './dto/create-wearable-sample.dto'

@Injectable()
export class WearableSampleService {
  constructor(private readonly prisma: PrismaService) {}

  async createBulk(userId: string, samples: CreateWearableSampleDto[]) {
    const result = await this.prisma.wearableSample.createMany({
      data: samples.map((s) => ({
        userId,
        type: s.type,
        timestamp: new Date(s.timestamp),
        value: s.value,
      })),
      skipDuplicates: true,
    })
    return { created: result.count }
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
