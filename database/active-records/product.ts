import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ProductCategory from '#database/active-records/product_category'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare private id: crypto.UUID

  @column({ columnName: 'category_id' })
  declare private categoryId: crypto.UUID

  @column()
  declare private designation: string

  @column({ columnName: 'product_slug' })
  declare private slug: string

  @column()
  declare private description: string

  @column({ columnName: 'picture_url' })
  declare private pictureUrl: string

  @column()
  declare private price: number

  @column()
  declare private brand: string

  @column({ columnName: 'is_available' })
  declare private isAvailable: boolean

  @column({ columnName: 'is_deleted' })
  declare private isDeleted: boolean

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare private createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare private updatedAt: DateTime

  // @ts-ignore
  @belongsTo(() => ProductCategory, { foreignKey: 'categoryId' })
  declare private category: BelongsTo<typeof ProductCategory>

  @beforeCreate()
  static async beforeCreate(product: Product) {
    product.id = crypto.randomUUID()
  }
}
