import EntityManager from '#database/active-records/market_service'
import { MarketServiceReadModel } from '#kernel/market/application/read-model/market_service_read_model'
import { MarketServiceDetailsDto } from '#kernel/market/application/dto/market_service_read_dto'

export class MarketServiceARReadModel implements MarketServiceReadModel {
  async getById(marketServiceId: string): Promise<MarketServiceDetailsDto | null> {
    const ms = await EntityManager.query().where('id', marketServiceId).preload('thumbnail').first()

    if (!ms) {
      return null
    }

    return {
      id: ms.id,
      slug: ms.slug,
      designation: ms.designation,
      thumbnailUrl: ms.thumbnail?.url ?? null,
      thumbnailId: ms.thumbnailId ?? null,
      shortDescription: ms.shortDescription ?? null,
      contentDescription: ms.contentDescription ?? null,
      createdAt: ms.createdAt,
      updatedAt: ms.updatedAt,
    }
  }
}
