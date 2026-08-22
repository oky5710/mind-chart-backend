import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { RequestIdMiddleware } from './common/request-id.middleware'
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
import { UserModule } from './user/user.module'

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
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
  }
}
