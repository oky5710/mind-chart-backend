import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { HrvModule } from './hrv/hrv.module'
import { EventModule } from './event/event.module'
import { MedicationModule } from './medication/medication.module'
import { DrugModule } from './drug/drug.module'
import { ExerciseModule } from './exercise/exercise.module'
import { CoffeeModule } from './coffee/coffee.module'
import { MoodModule } from './mood/mood.module'
import { WearableModule } from './wearable/wearable.module'

@Module({
  imports: [PrismaModule, AuthModule, HrvModule, EventModule, MedicationModule, DrugModule, ExerciseModule, CoffeeModule, MoodModule, WearableModule],
})
export class AppModule {}
