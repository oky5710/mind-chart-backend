import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { DrugService } from './drug.service'
import { SaveDrugDto } from './dto/save-drug.dto'
import { Public } from '../auth/public.decorator'

@Controller('drugs')
export class DrugController {
  constructor(private readonly drug: DrugService) {}

  @Public()
  @Get('search')
  search(
    @Query('name') name: string,
    @Query('pageNo') pageNo = 1,
    @Query('numOfRows') numOfRows = 10,
  ) {
    return this.drug.search(name, +pageNo, +numOfRows)
  }

  @Post()
  save(@Body() dto: SaveDrugDto) {
    return this.drug.save(dto)
  }

  @Public()
  @Get()
  findAll() {
    return this.drug.findAll()
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drug.findOne(id)
  }
}
