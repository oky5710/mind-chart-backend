import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { MoodService } from './mood.service'
import { CreateMoodLogDto } from './dto/create-mood-log.dto'

@Controller('moods')
export class MoodController {
  constructor(private readonly mood: MoodService) {}

  @Post()
  create(@Body() dto: CreateMoodLogDto) {
    return this.mood.create(dto)
  }

  @Get()
  findAll(@Query('date') date?: string) {
    return this.mood.findAll(date)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mood.remove(id)
  }
}
