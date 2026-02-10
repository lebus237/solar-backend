import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'
import { MarketServiceFeature } from '#kernel/market/core/type/market_service_feature_type'
import type { MarketServiceContentDescription } from '#kernel/market/core/type/market_service_content_description.type'

export default class MarketService extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'service_slug' })
  declare slug: string

  @column({ columnName: 'short_description' })
  declare shortDescription: string

  @column({ columnName: 'thumbnail_url' })
  declare thumbnail: string

  @column({ columnName: 'content_description' })
  declare contentDescription: MarketServiceContentDescription

  @column({ columnName: 'features_list' })
  declare features: Array<MarketServiceFeature>

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
