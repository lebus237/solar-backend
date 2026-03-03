import { DateTime } from 'luxon'
import { afterFind, afterFetch, BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'
import ProductCategory from '#database/active-records/product_category'
import ImageMedia from '#database/active-records/image_media'

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

  @column({ columnName: 'picture_id' })
  declare pictureId: crypto.UUID

  @column()
  declare price: number

  @column()
  declare brand: string

  @column({ columnName: 'is_available' })
  declare isAvailable: boolean

  @column({ columnName: 'is_deleted' })
  declare isDeleted: boolean

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  declare picture: ImageMedia | null

  declare category: ProductCategory | null

  @beforeCreate()
  static async beforeCreate(product: Product) {
    product.id = crypto.randomUUID()
  }

  @afterFind()
  static async afterFind(product: Product) {
    if (product.pictureId) {
      product.picture = await ImageMedia.find(product.pictureId)
    }
    if (product.categoryId) {
      product.category = await ProductCategory.find(product.categoryId)
    }
  }

  @afterFetch()
  static async afterFetch(products: Product[]) {
    await Promise.all(
      products.map(async (product) => {
        if (product.pictureId) {
          product.picture = await ImageMedia.find(product.pictureId)
        }
        if (product.categoryId) {
          product.category = await ProductCategory.find(product.categoryId)
        }
      })
    )
  }
}
