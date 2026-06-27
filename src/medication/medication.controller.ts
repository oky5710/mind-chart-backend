import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { MedicationService } from './medication.service'
import { CreateMedicationDto } from './dto/create-medication.dto'
import { CreateMedicationLogDto } from './dto/create-medication-log.dto'
import { CreateMedicationChangeDto } from './dto/create-medication-change.dto'

@Controller('medications')
export class MedicationController {
  constructor(private readonly medication: MedicationService) {}

  @Post()
  createMedication(@Body() dto: CreateMedicationDto) {
    return this.medication.createMedication(dto)
  }

  @Get()
  findAllMedications() {
    return this.medication.findAllMedications()
  }

  @Post('logs')
  createLog(@Body() dto: CreateMedicationLogDto) {
    return this.medication.createLog(dto)
  }

  @Get('logs')
  findLogs(@Query('date') date?: string) {
    return this.medication.findLogs(date)
  }

  @Post('changes')
  createChange(@Body() dto: CreateMedicationChangeDto) {
    return this.medication.createChange(dto)
  }

  @Get('changes')
  findChanges() {
    return this.medication.findChanges()
  }

  @Delete(':id')
  removeMedication(@Param('id') id: string) {
    return this.medication.removeMedication(id)
  }
}
