import { Module } from '@nestjs/common'
import { WearableSampleController } from './wearable-sample.controller'
import { WearableSampleService } from './wearable-sample.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [WearableSampleController],
  providers: [WearableSampleService],
})
export class WearableSampleModule {}
