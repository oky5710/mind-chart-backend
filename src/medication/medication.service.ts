import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMedicationDto } from './dto/create-medication.dto'
import { CreateMedicationLogDto } from './dto/create-medication-log.dto'
import { CreateMedicationChangeDto } from './dto/create-medication-change.dto'

@Injectable()
export class MedicationService {
  constructor(private readonly prisma: PrismaService) {}

  createMedication(dto: CreateMedicationDto) {
    return this.prisma.medication.create({ data: dto })
  }

  findAllMedications() {
    return this.prisma.medication.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    })
  }

  createLog(dto: CreateMedicationLogDto) {
    return this.prisma.medicationLog.create({
      data: { ...dto, date: new Date(dto.date) },
      include: { medication: true },
    })
  }

  findLogs(date?: string) {
    return this.prisma.medicationLog.findMany({
      where: { ...(date && { date: new Date(date) }) },
      include: { medication: true },
      orderBy: { date: 'desc' },
    })
  }

  createChange(dto: CreateMedicationChangeDto) {
    return this.prisma.medicationChange.create({
      data: { ...dto, date: new Date(dto.date) },
      include: { medication: true },
    })
  }

  findChanges() {
    return this.prisma.medicationChange.findMany({
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
