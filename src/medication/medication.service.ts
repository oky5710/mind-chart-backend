import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMedicationDto } from './dto/create-medication.dto'
import { CreateMedicationLogDto } from './dto/create-medication-log.dto'
import { CreateMedicationChangeDto } from './dto/create-medication-change.dto'
import type { DoseTiming } from './dto/quick-log.dto'
import { findOwnedOrThrow } from '../common/find-owned.util'

@Injectable()
export class MedicationService {
  constructor(private readonly prisma: PrismaService) {}

  async createMedication(dto: CreateMedicationDto) {
    if (dto.itemSeq) {
      const existing = await this.prisma.medication.findUnique({ where: { itemSeq: dto.itemSeq } })
      if (existing) {
        return this.prisma.medication.update({
          where: { itemSeq: dto.itemSeq },
          data: { ...dto, deletedAt: null },
        })
      }
    }
    return this.prisma.medication.create({ data: dto })
  }

  findAllMedications() {
    return this.prisma.medication.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    })
  }

  createLog(userId: string, dto: CreateMedicationLogDto) {
    return this.prisma.medicationLog.create({
      data: { ...dto, userId, date: new Date(dto.date) },
      include: { medication: true },
    })
  }

  findLogs(userId: string, date?: string) {
    return this.prisma.medicationLog.findMany({
      where: { userId, ...(date && { date: new Date(date) }) },
      include: { medication: true },
      orderBy: { date: 'desc' },
    })
  }

  // 메인 화면 아침/취침 퀵버튼 — 해당 시간대에 복용하는 약 전부를 한 번에 복용 처리
  // date는 프론트가 보낸 사용자 로컬 날짜(YYYY-MM-DD)를 그대로 씀 (서버 UTC 자정 기준으로
  // 계산하면 자정 근처에 사용자 로컬 날짜와 하루 어긋날 수 있음)
  async logTiming(userId: string, timing: DoseTiming, date: string) {
    const medications = await this.prisma.medication.findMany({
      where: { deletedAt: null, timings: { has: timing } },
    })
    const dateObj = new Date(date)
    const now = new Date()
    return Promise.all(
      medications.map((med) =>
        this.prisma.medicationLog.upsert({
          where: { userId_medicationId_date_timing: { userId, medicationId: med.id, date: dateObj, timing } },
          create: { userId, medicationId: med.id, date: dateObj, timing, takenAt: now, taken: true },
          update: { takenAt: now, taken: true },
          include: { medication: true },
        }),
      ),
    )
  }

  createChange(userId: string, dto: CreateMedicationChangeDto) {
    return this.prisma.medicationChange.create({
      data: { ...dto, userId, date: new Date(dto.date) },
      include: { medication: true },
    })
  }

  findChanges(userId: string) {
    return this.prisma.medicationChange.findMany({
      where: { userId },
      include: { medication: true },
      orderBy: { date: 'desc' },
    })
  }

  removeMedication(id: string) {
    return this.prisma.medication.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  async removeLog(userId: string, id: string) {
    const record = await this.prisma.medicationLog.findFirst({ where: { id, userId } })
    findOwnedOrThrow(record)
    return this.prisma.medicationLog.delete({ where: { id } })
  }
}
