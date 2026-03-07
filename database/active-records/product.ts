import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import ProductCategory from '#database/active-records/product_category'
import ImageMedia from '#database/active-records/image_media'
import ProductImage from '#database/active-records/product_image'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'category_id' })
  declare categoryId: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'product_slug' })
  declare slug: string

  @column()
  declare description: string

  @column({ columnName: 'main_image_id' })
  declare mainImageId: crypto.UUID

  @column()
  declare price: number

  @column()
  declare brand: string

  @column({ columnName: 'is_available' })
  declare isAvailable: boolean

  @column({ columnName: 'is_deleted' })
  declare isDeleted: boolean

  @column({ columnName: 'stock_quantity' })
  declare stockQuantity: number

  @column({ columnName: 'low_stock_threshold' })
  declare lowStockThreshold: number

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => ImageMedia, {
    foreignKey: 'mainImageId',
  })
  declare mainImage: BelongsTo<typeof ImageMedia>

  @belongsTo(() => ProductCategory, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof ProductCategory>

  @hasMany(() => ProductImage, {
    foreignKey: 'productId',
  })
  declare productImages: HasMany<typeof ProductImage>

  @manyToMany(() => ImageMedia, {
    pivotTable: 'product_images',
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'image_id',
    pivotColumns: ['sort_order'],
    serializeAs: 'images',
    pivotTimestamps: true,
  })
  declare images: ManyToMany<typeof ImageMedia>

  @beforeCreate()
  static async beforeCreate(product: Product) {
    product.id = crypto.randomUUID()
  }
}
