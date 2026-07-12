import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common'
import { HrvService } from './hrv.service'
import { CreateHrvDto } from './dto/create-hrv.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('hrv')
export class HrvController {
  constructor(private readonly hrv: HrvService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateHrvDto) {
    return this.hrv.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.hrv.findAll(user.id)
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id', ParseIntPipe) id: number) {
    return this.hrv.findOne(user.id, id)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateHrvDto>,
  ) {
    return this.hrv.update(user.id, id, dto)
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id', ParseIntPipe) id: number) {
    return this.hrv.remove(user.id, id)
  }
}
