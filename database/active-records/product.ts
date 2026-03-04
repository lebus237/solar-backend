import { DateTime } from 'luxon'
import { afterFind, afterFetch, BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
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

  declare mainImage: ImageMedia | null
  declare images: ImageMedia[]

  declare category: ProductCategory | null

  @beforeCreate()
  static async beforeCreate(product: Product) {
    product.id = crypto.randomUUID()
  }

  @afterFind()
  static async afterFind(product: Product) {
    if (product.mainImageId) {
      product.mainImage = await ImageMedia.find(product.mainImageId)
    }
    if (product.categoryId) {
      product.category = await ProductCategory.find(product.categoryId)
    }
    // Load additional images from junction table
    const productImages = await ProductImage.query()
      .where('product_id', product.id)
      .orderBy('sort_order', 'asc')

    const imageIds = productImages.map((pi) => pi.imageId)
    if (imageIds.length > 0) {
      product.images = await ImageMedia.query().whereIn('id', imageIds)
    } else {
      product.images = []
    }
  }

  @afterFetch()
  static async afterFetch(products: Product[]) {
    await Promise.all(
      products.map(async (product) => {
        if (product.mainImageId) {
          product.mainImage = await ImageMedia.find(product.mainImageId)
        }
        if (product.categoryId) {
          product.category = await ProductCategory.find(product.categoryId)
        }
        // Load additional images from junction table
        const productImages = await ProductImage.query()
          .where('product_id', product.id)
          .orderBy('sort_order', 'asc')

        const imageIds = productImages.map((pi) => pi.imageId)
        if (imageIds.length > 0) {
          product.images = await ImageMedia.query().whereIn('id', imageIds)
        } else {
          product.images = []
        }
      })
    )
  }
}
