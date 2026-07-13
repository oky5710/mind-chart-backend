import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ExerciseService } from './exercise.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exercise: ExerciseService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateExerciseDto) {
    return this.exercise.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload, @Query('date') date?: string) {
    return this.exercise.findAll(user.id, date)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: Partial<CreateExerciseDto>,
  ) {
    return this.exercise.update(user.id, id, dto)
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.exercise.remove(user.id, id)
  }
}
