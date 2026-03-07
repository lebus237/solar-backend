import { DateTime } from 'luxon'
import { beforeCreate, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import Product from '#database/active-records/product'

export default class StockMovement extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'product_id' })
  declare productId: crypto.UUID

  @column({ columnName: 'operation_type' })
  declare operationType: string

  @column()
  declare quantity: number

  @column({ columnName: 'previous_quantity' })
  declare previousQuantity: number

  @column({ columnName: 'new_quantity' })
  declare newQuantity: number

  @column()
  declare reason: string | null

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  declare product: BelongsTo<typeof Product>

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static async beforeCreate(stockMovement: StockMovement) {
    stockMovement.id = crypto.randomUUID()
  }
}
