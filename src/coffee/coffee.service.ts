import { Injectable } from '@nestjs/common'
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

  remove(userId: string, id: string) {
    return this.prisma.coffeeLog.deleteMany({ where: { id, userId } })
  }
}
