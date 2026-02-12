import { MarketService } from '#kernel/market/domain/entity/market_service'
import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { AppId } from '#shared/domain/app_id'
import EntityManager from '#database/active-records/market_service'

export class MarketServiceARRepository implements MarketServiceRepository {
  async save(entity: MarketService): Promise<void> {
    const object = {
      designation: entity['designation'],
      thumbnailId: entity.getThumbnailId()?.value,
      thumbnailUrl: entity['thumbnailUrl'],
      shortDescription: entity['shortDescription'],
      contentDescription: entity.getContent(),
      features: JSON.stringify(entity.getFeatures()),
      slug: entity.getSlug(),
    }

    !entity.getId()
      ? await EntityManager.create(object)
      : await EntityManager.updateOrCreate({ id: entity.getId()?.value }, object)
  }

  async getById(id: AppId): Promise<MarketService> {
    const marketService = await EntityManager.findOrFail(id.value)

    return new MarketService(
      AppId.fromString(marketService?.id),
      marketService?.designation,
      marketService?.thumbnailUrl,
      AppId.fromString(marketService?.thumbnailId),
      marketService?.contentDescription,
      marketService?.shortDescription,
      marketService?.features,
      [],
      marketService?.createdAt,
      marketService?.updatedAt
    )
  }

  async delete(id: AppId): Promise<void> {
    const marketService = await EntityManager.findOrFail(id.value)

    await marketService.delete()
  }
}
