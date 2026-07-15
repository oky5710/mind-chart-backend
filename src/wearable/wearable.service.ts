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

  async upsert(userId: string, dto: UpsertWearableDto) {
    const { date, sleepStart, sleepEnd, sleepDuration, ...data } = dto
    const dateObj = this.parseDate(date)
    const sleepStartDate = sleepStart !== undefined ? this.parseDate(sleepStart) : undefined
    const sleepEndDate = sleepEnd !== undefined ? this.parseDate(sleepEnd) : undefined
    // 시작/종료 시각이 둘 다 있으면 수면 시간(시간 단위)은 항상 여기서 계산함
    // (단축어에서 따로 계산해서 보낼 필요 없음)
    const computedSleepDuration =
      sleepStartDate && sleepEndDate
        ? (sleepEndDate.getTime() - sleepStartDate.getTime()) / (1000 * 60 * 60)
        : sleepDuration
    const payload = {
      ...data,
      ...(sleepStartDate && { sleepStart: sleepStartDate }),
      ...(sleepEndDate && { sleepEnd: sleepEndDate }),
      ...(computedSleepDuration !== undefined && { sleepDuration: computedSleepDuration }),
    }
    const existing = await this.prisma.wearableData.findFirst({
      where: { userId, date: dateObj },
    })
    if (existing) {
      return this.prisma.wearableData.update({
        where: { id: existing.id },
        data: payload,
      })
    }
    return this.prisma.wearableData.create({
      data: { userId, date: dateObj, ...payload },
    })
  }

  upsertBulk(userId: string, dtos: UpsertWearableDto[]) {
    return Promise.all(dtos.map((dto) => this.upsert(userId, dto)))
  }

  findAll(userId: string, date?: string) {
    return this.prisma.wearableData.findMany({
      where: { userId, ...(date && { date: new Date(date) }) },
      orderBy: { date: 'desc' },
    })
  }
}
