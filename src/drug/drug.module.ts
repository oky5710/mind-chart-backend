import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { DrugService } from './drug.service'
import { DrugController } from './drug.controller'

@Module({
  imports: [HttpModule],
  providers: [DrugService],
  controllers: [DrugController],
})
export class DrugModule {}
