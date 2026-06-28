import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { CoffeeService } from './coffee.service'
import { CreateCoffeeLogDto } from './dto/create-coffee-log.dto'

@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffee: CoffeeService) {}

  @Post()
  create(@Body() dto: CreateCoffeeLogDto) {
    return this.coffee.create(dto)
  }

  @Get()
  findAll(@Query('date') date?: string) {
    return this.coffee.findAll(date)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffee.remove(id)
  }
}
