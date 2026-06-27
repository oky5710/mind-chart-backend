import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { EventService } from './event.service'
import { CreateEventDto } from './dto/create-event.dto'

@Controller('events')
export class EventController {
  constructor(private readonly events: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.events.create(dto)
  }

  @Get()
  findAll(@Query('date') date?: string) {
    return this.events.findAll(date)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.events.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateEventDto>) {
    return this.events.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.events.remove(id)
  }
}
