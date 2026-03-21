import { MarketService } from '#kernel/market/domain/entity/market_service'
import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { AppId } from '#shared/domain/app_id'
import EntityManager from '#database/active-records/market_service'
import { ImageMedia } from '#kernel/medias/domain/image_media'

export class MarketServiceARRepository implements MarketServiceRepository {
  async save(entity: MarketService): Promise<void> {
    const object = {
      designation: entity.getDesignation(),
      thumbnailId: entity.getThumbnailId()?.value,
      shortDescription: entity.getShortDescription(),
      contentDescription: entity.getContent(),
      features: JSON.stringify(entity.getFeatures()),
      slug: entity.getSlug(),
    }

    !entity.getId()
      ? await EntityManager.create(object)
      : await EntityManager.updateOrCreate({ id: entity.getId()?.value }, object)
  }

  async getById(id: AppId): Promise<MarketService> {
    const marketService = await EntityManager.query()
      .where('id', id.value)
      .preload('thumbnail')
      .firstOrFail()

    const thumbnail = marketService.thumbnail
      ? new ImageMedia(
          AppId.fromString(marketService.thumbnail.id),
          marketService.thumbnail.title,
          marketService.thumbnail.url,
          marketService.thumbnail.altDescription,
          marketService.thumbnail.metadata,
          marketService.thumbnail.createdAt as any,
          marketService.thumbnail.updatedAt as any,
          marketService.thumbnail.relativeKey,
          marketService.thumbnail.createdBy
        )
      : null

    return new MarketService(
      AppId.fromString(marketService.id),
      marketService.designation,
      thumbnail,
      marketService.contentDescription,
      marketService.shortDescription,
      marketService.features,
      [],
      marketService.createdAt,
      marketService.updatedAt
    )
  }

  async delete(id: AppId): Promise<void> {
    const marketService = await EntityManager.findOrFail(id.value)

    await marketService.delete()
  }
}
