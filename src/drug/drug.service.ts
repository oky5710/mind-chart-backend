import { Injectable, BadRequestException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { PrismaService } from '../prisma/prisma.service'
import { SaveDrugDto } from './dto/save-drug.dto'

export interface DrugApiItem {
  itemSeq: string
  itemName: string
  entpName: string
  efcyQesitm: string
  useMethodQesitm: string
  atpnWarnQesitm: string
  atpnQesitm: string
  intrcQesitm: string
  seQesitm: string
  depositMethodQesitm: string
  itemImage: string | null
}

interface DrugApiResponse {
  header: { resultCode: string; resultMsg: string }
  body: {
    totalCount: number
    pageNo: number
    numOfRows: number
    items: DrugApiItem[]
  }
}

@Injectable()
export class DrugService {
  private readonly apiUrl = process.env.DRUG_API_URL
  private readonly apiKey = process.env.DRUG_API_KEY

  constructor(
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async search(name: string, pageNo = 1, numOfRows = 10) {
    if (!name?.trim()) throw new BadRequestException('검색어를 입력해주세요')

    const { data } = await firstValueFrom(
      this.http.get<DrugApiResponse>(`${this.apiUrl}/getDrbEasyDrugList`, {
        params: {
          serviceKey: this.apiKey,
          itemName: name,
          type: 'json',
          pageNo,
          numOfRows,
        },
      }),
    )

    const { header, body } = data
    if (header.resultCode !== '00') {
      throw new BadRequestException(`약 검색 실패: ${header.resultMsg}`)
    }

    return {
      totalCount: body.totalCount,
      pageNo: body.pageNo,
      numOfRows: body.numOfRows,
      items: body.items,
    }
  }

  save(dto: SaveDrugDto) {
    return this.prisma.medication.upsert({
      where: { itemSeq: dto.itemSeq ?? undefined },
      update: {
        name: dto.name,
        entpName: dto.entpName,
        efcyQesitm: dto.efcyQesitm,
        useMethodQesitm: dto.useMethodQesitm,
        atpnWarnQesitm: dto.atpnWarnQesitm,
        atpnQesitm: dto.atpnQesitm,
        intrcQesitm: dto.intrcQesitm,
        seQesitm: dto.seQesitm,
        depositMethodQesitm: dto.depositMethodQesitm,
        itemImage: dto.itemImage,
      },
      create: dto,
    })
  }

  findAll() {
    return this.prisma.medication.findMany({ orderBy: { name: 'asc' } })
  }

  findOne(id: string) {
    return this.prisma.medication.findUnique({ where: { id } })
  }
}
