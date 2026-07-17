import { Module } from '@nestjs/common'
import { WearableController } from './wearable.controller'
import { WearableService } from './wearable.service'

@Module({
  controllers: [WearableController],
  providers: [WearableService],
})
export class WearableModule {}
