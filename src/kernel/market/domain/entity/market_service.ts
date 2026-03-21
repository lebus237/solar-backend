import { AppId } from '#shared/domain/app_id'
import string from '@adonisjs/core/helpers/string'
import { MarketServiceFeature } from '#kernel/market/domain/type/market_service_feature_type'
import { MarketServiceContentDescription } from '#kernel/market/domain/type/market_service_content_description.type'
import { ImageMedia } from '#kernel/medias/domain/image_media'

export class MarketService {
  private slug: string

  constructor(
    private id: AppId | null,
    private readonly designation: string,
    private readonly thumbnail: ImageMedia | null,
    private contentDescription: MarketServiceContentDescription,
    private readonly shortDescription?: string,
    private readonly features?: Array<MarketServiceFeature>,
    private readonly images?: string[],
    private createdAt?: any,
    private updatedAt?: any
  ) {
    this.slug = string.slug(this.designation + '-' + string.generateRandom(8)).toLowerCase()
  }

  getId() {
    return this.id
  }

  getDesignation(): string {
    return this.designation
  }

  getContent() {
    return this.contentDescription
  }

  getSlug(): string {
    return this.slug
  }

  getThumbnail(): ImageMedia | null {
    return this.thumbnail
  }

  getThumbnailId(): AppId | null {
    return this.thumbnail?.getId() ? AppId.fromString(this.thumbnail.getId() as string) : null
  }

  getShortDescription(): string | undefined {
    return this.shortDescription
  }

  getFeatures(): Array<MarketServiceFeature> {
    return this.features ?? []
  }

  getCreatedAt(): any {
    return this.createdAt
  }

  getUpdatedAt(): any {
    return this.updatedAt
  }

  getImages(): any {
    return this.images
  }
}
