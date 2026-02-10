import { IdentifierInterface } from '#shared/domain/identifier'
import string from '@adonisjs/core/helpers/string'
import { MarketServiceFeature } from '../type/market_service_feature_type'
import { MarketServiceContentDescription } from '../type/market_service_content_description.type'

export class MarketService {
  private slug: string

  constructor(
    private id: IdentifierInterface,
    private readonly designation: string,
    private readonly thumbnail: string,
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

  getThumbnail(): string {
    return this.thumbnail
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

  getShortDescription() {
    return this.shortDescription
  }
}
