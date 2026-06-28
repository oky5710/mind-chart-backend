import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { ExerciseService } from './exercise.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exercise: ExerciseService) {}

  @Post()
  create(@Body() dto: CreateExerciseDto) {
    return this.exercise.create(dto)
  }

  @Get()
  findAll(@Query('date') date?: string) {
    return this.exercise.findAll(date)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercise.remove(id)
  }
}
