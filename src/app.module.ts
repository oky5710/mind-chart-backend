import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { HrvModule } from './hrv/hrv.module'
import { EventModule } from './event/event.module'
import { MedicationModule } from './medication/medication.module'
import { MedicationReminderModule } from './medication-reminder/medication-reminder.module'
import { DrugModule } from './drug/drug.module'
import { ExerciseModule } from './exercise/exercise.module'
import { CoffeeModule } from './coffee/coffee.module'
import { MoodModule } from './mood/mood.module'
import { RmssdEventModule } from './rmssd-event/rmssd-event.module'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HrvModule,
    EventModule,
    MedicationModule,
    MedicationReminderModule,
    DrugModule,
    ExerciseModule,
    CoffeeModule,
    MoodModule,
    RmssdEventModule,
  ],
})
export class AppModule {}
