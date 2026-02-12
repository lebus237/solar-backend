import { DateTime } from 'luxon'
import { afterFind, BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'

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

  @column({ columnName: 'thumbnail_url' })
  declare thumbnailUrl: string

  @column({ columnName: 'content_description' })
  declare contentDescription: any

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
