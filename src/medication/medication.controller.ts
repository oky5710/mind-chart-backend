import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { MedicationService } from './medication.service'
import { CreateMedicationDto } from './dto/create-medication.dto'
import { CreateMedicationLogDto } from './dto/create-medication-log.dto'
import { CreateMedicationChangeDto } from './dto/create-medication-change.dto'
import { QuickLogDto } from './dto/quick-log.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

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
  createLog(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateMedicationLogDto) {
    return this.medication.createLog(user.id, dto)
  }

  // 메인 화면 아침/취침 퀵버튼
  @Post('logs/quick')
  logTiming(@CurrentUser() user: CurrentUserPayload, @Body() dto: QuickLogDto) {
    return this.medication.logTiming(user.id, dto.timing, dto.date)
  }

  @Get('logs')
  findLogs(@CurrentUser() user: CurrentUserPayload, @Query('date') date?: string) {
    return this.medication.findLogs(user.id, date)
  }

  @Delete('logs/:id')
  removeLog(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.medication.removeLog(user.id, id)
  }

  @Post('changes')
  createChange(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateMedicationChangeDto) {
    return this.medication.createChange(user.id, dto)
  }

  @Get('changes')
  findChanges(@CurrentUser() user: CurrentUserPayload) {
    return this.medication.findChanges(user.id)
  }

  @Delete(':id')
  removeMedication(@Param('id') id: string) {
    return this.medication.removeMedication(id)
  }
}
