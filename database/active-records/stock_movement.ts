import { DateTime } from 'luxon'
import { beforeCreate, BaseModel, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'

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

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static async beforeCreate(stockMovement: StockMovement) {
    stockMovement.id = crypto.randomUUID()
  }
}
