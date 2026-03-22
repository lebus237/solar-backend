import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, belongsTo } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'
import Store from '#database/active-records/store'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { BusinessDay } from '#shared/domain/value-objects/business_day'

export default class StoreBusinessHours extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'store_id' })
  declare storeId: crypto.UUID

  @column()
  declare day: BusinessDay

  @column()
  declare open: number

  @column()
  declare close: number

  @belongsTo(() => Store, {
    foreignKey: 'storeId',
  })
  declare store: BelongsTo<typeof Store>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async generate(store: StoreBusinessHours) {
    store.id = crypto.randomUUID()
  }
}
