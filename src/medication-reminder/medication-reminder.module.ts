import { Module } from '@nestjs/common'
import { MedicationReminderController } from './medication-reminder.controller'
import { MedicationReminderService } from './medication-reminder.service'

@Module({
  controllers: [MedicationReminderController],
  providers: [MedicationReminderService],
})
export class MedicationReminderModule {}
