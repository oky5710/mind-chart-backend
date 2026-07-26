import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common'
import { MedicationReminderService } from './medication-reminder.service'
import { CreateMedicationReminderDto } from './dto/create-medication-reminder.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('medication-reminders')
export class MedicationReminderController {
  constructor(private readonly reminders: MedicationReminderService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateMedicationReminderDto) {
    return this.reminders.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.reminders.findAll(user.id)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: Partial<CreateMedicationReminderDto>,
  ) {
    return this.reminders.update(user.id, id, dto)
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.reminders.remove(user.id, id)
  }
}
