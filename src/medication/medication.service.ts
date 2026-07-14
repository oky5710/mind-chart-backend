import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMedicationDto } from './dto/create-medication.dto'
import { CreateMedicationLogDto } from './dto/create-medication-log.dto'
import { CreateMedicationChangeDto } from './dto/create-medication-change.dto'
import type { DoseTiming } from './dto/quick-log.dto'

function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

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
  async logTiming(userId: string, timing: DoseTiming) {
    const medications = await this.prisma.medication.findMany({
      where: { deletedAt: null, timings: { has: timing } },
    })
    const today = startOfToday()
    const now = new Date()
    return Promise.all(
      medications.map((med) =>
        this.prisma.medicationLog.upsert({
          where: { userId_medicationId_date_timing: { userId, medicationId: med.id, date: today, timing } },
          create: { userId, medicationId: med.id, date: today, timing, takenAt: now, taken: true },
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
}
