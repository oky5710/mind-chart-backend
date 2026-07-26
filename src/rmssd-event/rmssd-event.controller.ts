import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common'
import { RmssdEventService } from './rmssd-event.service'
import { CreateRmssdEventDto } from './dto/create-rmssd-event.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('rmssd-events')
export class RmssdEventController {
  constructor(private readonly rmssdEvents: RmssdEventService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateRmssdEventDto) {
    return this.rmssdEvents.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.rmssdEvents.findAll(user.id)
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.rmssdEvents.remove(user.id, id)
  }
}
