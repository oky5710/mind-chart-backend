import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { WearableService } from './wearable.service'
import { UpsertWearableDto } from './dto/upsert-wearable.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('wearable')
export class WearableController {
  constructor(private readonly wearable: WearableService) {}

  @Post()
  upsert(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpsertWearableDto) {
    return this.wearable.upsert(user.id, dto)
  }

  @Post('bulk')
  upsertBulk(@CurrentUser() user: CurrentUserPayload, @Body() body: { data: UpsertWearableDto[] }) {
    return this.wearable.upsertBulk(user.id, body.data)
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload, @Query('date') date?: string) {
    return this.wearable.findAll(user.id, date)
  }
}
