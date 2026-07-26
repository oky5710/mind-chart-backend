import { Module } from '@nestjs/common'
import { RmssdEventController } from './rmssd-event.controller'
import { RmssdEventService } from './rmssd-event.service'

@Module({
  controllers: [RmssdEventController],
  providers: [RmssdEventService],
})
export class RmssdEventModule {}
