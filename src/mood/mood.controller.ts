import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { MoodService } from './mood.service'
import { CreateMoodLogDto } from './dto/create-mood-log.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('moods')
export class MoodController {
  constructor(private readonly mood: MoodService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateMoodLogDto) {
    return this.mood.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload, @Query('date') date?: string) {
    return this.mood.findAll(user.id, date)
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.mood.remove(user.id, id)
  }
}
