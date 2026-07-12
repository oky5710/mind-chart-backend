import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { EventService } from './event.service'
import { CreateEventDto } from './dto/create-event.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('events')
export class EventController {
  constructor(private readonly events: EventService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateEventDto) {
    return this.events.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload, @Query('date') date?: string) {
    return this.events.findAll(user.id, date)
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.events.findOne(user.id, id)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: Partial<CreateEventDto>,
  ) {
    return this.events.update(user.id, id, dto)
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.events.remove(user.id, id)
  }
}
