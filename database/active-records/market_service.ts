import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/orm'
import crypto from 'node:crypto'
import ImageMedia from '#database/active-records/image_media'

export default class MarketService extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'service_slug' })
  declare slug: string

  @column({ columnName: 'short_description' })
  declare shortDescription: string

  @column({ columnName: 'thumbnail_id' })
  declare thumbnailId: string

  @belongsTo(() => ImageMedia, {
    foreignKey: 'thumbnailId',
  })
  declare thumbnail: BelongsTo<typeof ImageMedia>

  @column({ columnName: 'content_description' })
  declare contentDescription: string | null

  @column({ columnName: 'features_list' })
  declare features: any

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static generate(marketService: MarketService) {
    marketService.id = crypto.randomUUID()
  }
  // @afterFind()
  // static async parseData(marketService: MarketService) {
  //   if (marketService.features) {
  //     marketService.features = JSON.parse(marketService.features)
  //   }
  // }
}
