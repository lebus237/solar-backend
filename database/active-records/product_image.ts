import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import ImageMedia from '#database/active-records/image_media'
import Product from '#database/active-records/product'

export default class ProductImage extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'product_id' })
  declare productId: crypto.UUID

  @column({ columnName: 'image_id' })
  declare imageId: crypto.UUID

  @column({ columnName: 'sort_order' })
  declare sortOrder: number

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => ImageMedia, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof ImageMedia>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async beforeCreate(productImage: ProductImage) {
    productImage.id = crypto.randomUUID()
  }
}
