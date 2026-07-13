import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common'
import { WearableSampleService } from './wearable-sample.service'
import { parseNdjsonSamples } from './dto/bulk-wearable-sample.dto'
import { WEARABLE_SAMPLE_TYPES } from './dto/create-wearable-sample.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import type { CurrentUserPayload } from '../auth/current-user.decorator'

@Controller('wearable-samples')
export class WearableSampleController {
  constructor(private readonly wearableSample: WearableSampleService) {}

  @Post('bulk')
  createBulk(@CurrentUser() user: CurrentUserPayload, @Body() body: any) {
    const items = parseNdjsonSamples(body?.data ?? body)
    return this.wearableSample.createBulk(user.id, items as any)
  }

  @Get()
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    if (!type || !WEARABLE_SAMPLE_TYPES.includes(type as (typeof WEARABLE_SAMPLE_TYPES)[number])) {
      throw new BadRequestException(`type은 ${WEARABLE_SAMPLE_TYPES.join(', ')} 중 하나여야 합니다`)
    }
    return this.wearableSample.findAll(user.id, type, from, to)
  }
}
