import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'

export default class ProductCategory extends BaseModel {
  @column({ isPrimary: true })
  declare private id: crypto.UUID

  @column()
  declare private designation: string

  @column({ columnName: 'category_slug' })
  declare private slug: string

  @column({ columnName: 'category_type' })
  declare private type: 'CATEGORY' | 'TAG'

  @column()
  declare private parentId: crypto.UUID

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare private createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare private updatedAt: DateTime

  @beforeCreate()
  static async beforeCreate(category: ProductCategory) {
    category.id = crypto.randomUUID()
  }
}
