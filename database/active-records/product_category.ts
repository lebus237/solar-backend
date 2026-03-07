import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import Product from '#database/active-records/product'

export default class ProductCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'category_slug' })
  declare slug: string

  @column({ columnName: 'category_type' })
  declare type: 'CATEGORY' | 'TAG'

  @column({ columnName: 'parent_id' })
  declare parentId: crypto.UUID

  @belongsTo(() => ProductCategory, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof ProductCategory>

  @hasMany(() => ProductCategory, {
    foreignKey: 'parentId',
  })
  declare children: HasMany<typeof ProductCategory>

  @hasMany(() => Product, {
    foreignKey: 'categoryId',
  })
  declare products: HasMany<typeof Product>

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async beforeCreate(category: ProductCategory) {
    category.id = crypto.randomUUID()
  }
}
