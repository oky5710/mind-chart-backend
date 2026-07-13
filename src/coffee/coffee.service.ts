import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCoffeeLogDto } from './dto/create-coffee-log.dto'

@Injectable()
export class CoffeeService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateCoffeeLogDto) {
    return this.prisma.coffeeLog.create({
      data: { ...dto, userId, date: new Date(dto.date) },
    })
  }

  findAll(userId: string, date?: string) {
    let dateFilter = {}
    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      dateFilter = { date: { gte: start, lt: end } }
    }
    return this.prisma.coffeeLog.findMany({
      where: { userId, ...dateFilter },
      orderBy: { date: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.coffeeLog.findFirst({ where: { id, userId } })
    if (!record) throw new NotFoundException()
    return record
  }

  async update(userId: string, id: string, dto: Partial<CreateCoffeeLogDto>) {
    await this.findOne(userId, id)
    return this.prisma.coffeeLog.update({
      where: { id },
      data: { ...dto, ...(dto.date && { date: new Date(dto.date) }) },
    })
  }

  remove(userId: string, id: string) {
    return this.prisma.coffeeLog.deleteMany({ where: { id, userId } })
  }
}
