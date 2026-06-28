import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpsertWearableDto } from './dto/upsert-wearable.dto'

@Injectable()
export class WearableService {
  constructor(private readonly prisma: PrismaService) {}

  private parseDate(date: any): Date {
    // ISO 형식(2026-06-28) 또는 ISO timestamp 우선 시도
    let d = new Date(date)
    if (!isNaN(d.getTime())) return d

    // 한국어 형식: "2026년 6월 28일" → "2026-06-28"
    const korean = date.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
    if (korean) {
      d = new Date(`${korean[1]}-${korean[2].padStart(2, '0')}-${korean[3].padStart(2, '0')}`)
      if (!isNaN(d.getTime())) return d
    }

    // iOS 단축어 형식: "2026. 6. 29. 오전 1:18"
    const iosKorean = date.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./)
    if (iosKorean) {
      d = new Date(`${iosKorean[1]}-${iosKorean[2].padStart(2, '0')}-${iosKorean[3].padStart(2, '0')}`)
      if (!isNaN(d.getTime())) return d
    }

    throw new Error(`날짜 형식을 인식할 수 없습니다: ${date}`)
  }

  async upsert(dto: UpsertWearableDto) {
    const { date, ...data } = dto
    const dateObj = this.parseDate(date)
    const existing = await this.prisma.wearableData.findFirst({
      where: { userId: null, date: dateObj },
    })
    if (existing) {
      return this.prisma.wearableData.update({
        where: { id: existing.id },
        data,
      })
    }
    return this.prisma.wearableData.create({
      data: { date: dateObj, ...data },
    })
  }

  upsertBulk(dtos: UpsertWearableDto[]) {
    return Promise.all(dtos.map((dto) => this.upsert(dto)))
  }

  findAll(date?: string) {
    return this.prisma.wearableData.findMany({
      where: { ...(date && { date: new Date(date) }) },
      orderBy: { date: 'desc' },
    })
  }
}
