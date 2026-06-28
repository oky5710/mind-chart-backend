import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { WearableService } from './wearable.service'
import { UpsertWearableDto } from './dto/upsert-wearable.dto'

@Controller('wearable')
export class WearableController {
  constructor(private readonly wearable: WearableService) {}

  @Post()
  upsert(@Body() dto: UpsertWearableDto) {
    return this.wearable.upsert(dto)
  }

  @Post('bulk')
  upsertBulk(@Body() body: { data: UpsertWearableDto[] }) {
    return this.wearable.upsertBulk(body.data)
  }

  @Get()
  findAll(@Query('date') date?: string) {
    return this.wearable.findAll(date)
  }
}
