import { Module } from '@nestjs/common'
import { WearableController } from './wearable.controller'
import { WearableService } from './wearable.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [WearableController],
  providers: [WearableService],
})
export class WearableModule {}
