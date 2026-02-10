import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'
import { MarketServiceFeature } from '#kernel/market/core/type/market_service_feature_type'

export default class MarketService extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'short_description' })
  declare shortDescription: string

  @column({ columnName: 'thumbnail_url' })
  declare thumbnail: string

  @column({ columnName: 'content_description' })
  declare contentDescription: any

  @column({ columnName: 'feature_list' })
  declare features: Array<MarketServiceFeature>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
