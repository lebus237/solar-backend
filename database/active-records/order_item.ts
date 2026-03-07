import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import Order from '#database/active-records/order'
import Product from '#database/active-records/product'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'order_id' })
  declare orderId: crypto.UUID

  @column({ columnName: 'product_id' })
  declare productId: crypto.UUID | null

  @column({ columnName: 'product_name' })
  declare productName: string

  @column({ columnName: 'product_slug' })
  declare productSlug: string | null

  @column()
  declare quantity: number

  @column({ columnName: 'unit_price' })
  declare unitPrice: number

  @column({ columnName: 'total_price' })
  declare totalPrice: number

  @belongsTo(() => Order, {
    foreignKey: 'orderId',
  })
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  declare product: BelongsTo<typeof Product>

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static async beforeCreate(orderItem: OrderItem) {
    orderItem.id = crypto.randomUUID()
  }
}
