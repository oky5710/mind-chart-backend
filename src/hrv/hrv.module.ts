import { Module } from '@nestjs/common'
import { HrvService } from './hrv.service'
import { HrvController } from './hrv.controller'

@Module({
  providers: [HrvService],
  controllers: [HrvController],
})
export class HrvModule {}
