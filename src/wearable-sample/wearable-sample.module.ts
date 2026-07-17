import { Module } from '@nestjs/common'
import { WearableSampleController } from './wearable-sample.controller'
import { WearableSampleService } from './wearable-sample.service'

@Module({
  controllers: [WearableSampleController],
  providers: [WearableSampleService],
})
export class WearableSampleModule {}
