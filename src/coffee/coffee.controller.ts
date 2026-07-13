import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { CoffeeService } from './coffee.service'
import { CreateCoffeeLogDto } from './dto/create-coffee-log.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffee: CoffeeService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateCoffeeLogDto) {
    return this.coffee.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload, @Query('date') date?: string) {
    return this.coffee.findAll(user.id, date)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: Partial<CreateCoffeeLogDto>,
  ) {
    return this.coffee.update(user.id, id, dto)
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.coffee.remove(user.id, id)
  }
}
