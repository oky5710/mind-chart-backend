import { Injectable, BadRequestException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { PrismaService } from '../prisma/prisma.service'
import { SaveDrugDto } from './dto/save-drug.dto'

// MdcinGrnIdntfcInfoService03 원본 응답 필드 (대문자 스네이크케이스)
interface RawDrugItem {
  ITEM_SEQ: string
  ITEM_NAME: string
  ENTP_NAME: string
  ITEM_IMAGE: string | null
  CLASS_NO: string
  CLASS_NAME: string
  ETC_OTC_NAME: string
  DRUG_SHAPE: string
  COLOR_CLASS1: string
  CHART: string
}

interface RawDrugApiResponse {
  header: { resultCode: string; resultMsg: string }
  body: {
    totalCount: number
    pageNo: number
    numOfRows: number
    items: RawDrugItem[] | { item: RawDrugItem | RawDrugItem[] } | null
  }
}

export interface DrugApiItem {
  itemSeq: string
  itemName: string
  entpName: string
  itemImage: string | null
  classNo: string
  className: string
  etcOtcName: string
  drugShape: string
  colorClass: string
  chart: string
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
      this.http.get<RawDrugApiResponse>(`${this.apiUrl}/getMdcinGrnIdntfcInfoList03`, {
        params: {
          serviceKey: this.apiKey,
          item_name: name,
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

    // 공공데이터 API는 결과 수에 따라 items 형태가 다름 (배열/단일객체/null)
    let rawItems: RawDrugItem[] = []
    if (Array.isArray(body.items)) {
      rawItems = body.items
    } else if (body.items && 'item' in body.items) {
      const item = (body.items as { item: RawDrugItem | RawDrugItem[] }).item
      rawItems = Array.isArray(item) ? item : [item]
    }

    const items: DrugApiItem[] = rawItems.map((r) => ({
      itemSeq:    r.ITEM_SEQ,
      itemName:   r.ITEM_NAME,
      entpName:   r.ENTP_NAME,
      itemImage:  r.ITEM_IMAGE ?? null,
      classNo:    r.CLASS_NO,
      className:  r.CLASS_NAME,
      etcOtcName: r.ETC_OTC_NAME,
      drugShape:  r.DRUG_SHAPE,
      colorClass: r.COLOR_CLASS1,
      chart:      r.CHART,
    }))

    return {
      totalCount: body.totalCount,
      pageNo:     body.pageNo,
      numOfRows:  body.numOfRows,
      items,
    }
  }

  save(dto: SaveDrugDto) {
    return this.prisma.medication.upsert({
      where: { itemSeq: dto.itemSeq ?? undefined },
      update: {
        name:       dto.name,
        entpName:   dto.entpName,
        itemImage:  dto.itemImage,
        drugShape:  dto.drugShape,
        colorClass: dto.colorClass,
        chart:      dto.chart,
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
