import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMedicationReminderDto } from './dto/create-medication-reminder.dto'
import { findOwnedOrThrow } from '../common/find-owned.util'

@Injectable()
export class MedicationReminderService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateMedicationReminderDto) {
    return this.prisma.medicationReminder.create({
      data: {
        userId,
        timing: dto.timing,
        repeatType: dto.repeatType,
        weekdays: dto.weekdays ?? [],
        time: dto.time,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    })
  }

  findAll(userId: string) {
    return this.prisma.medicationReminder.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.medicationReminder.findFirst({ where: { id, userId } })
    return findOwnedOrThrow(record)
  }

  async update(userId: string, id: string, dto: Partial<CreateMedicationReminderDto>) {
    await this.findOne(userId, id)
    const { weekdays, startDate, endDate, ...rest } = dto
    return this.prisma.medicationReminder.update({
      where: { id },
      data: {
        ...rest,
        ...(weekdays !== undefined && { weekdays }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
    })
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id)
    return this.prisma.medicationReminder.delete({ where: { id } })
  }
}
