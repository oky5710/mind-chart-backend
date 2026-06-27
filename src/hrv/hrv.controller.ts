import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common'
import { HrvService } from './hrv.service'
import { CreateHrvDto } from './dto/create-hrv.dto'

@Controller('hrv')
export class HrvController {
  constructor(private readonly hrv: HrvService) {}

  @Post()
  create(@Body() dto: CreateHrvDto) {
    return this.hrv.create(dto)
  }

  @Get()
  findAll() {
    return this.hrv.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hrv.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateHrvDto>) {
    return this.hrv.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hrv.remove(id)
  }
}
