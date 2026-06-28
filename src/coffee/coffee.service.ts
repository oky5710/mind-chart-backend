import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCoffeeLogDto } from './dto/create-coffee-log.dto'

@Injectable()
export class CoffeeService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCoffeeLogDto) {
    return this.prisma.coffeeLog.create({
      data: { ...dto, date: new Date(dto.date) },
    })
  }

  findAll(date?: string) {
    let dateFilter = {}
    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      dateFilter = { date: { gte: start, lt: end } }
    }
    return this.prisma.coffeeLog.findMany({
      where: dateFilter,
      orderBy: { date: 'desc' },
    })
  }

  remove(id: string) {
    return this.prisma.coffeeLog.delete({ where: { id } })
  }
}
