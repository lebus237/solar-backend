import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import Address from '#database/active-records/address'
import Order from '#database/active-records/order'
import User from '#database/active-records/user'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'user_id' })
  declare userId: crypto.UUID | null

  @column({ columnName: 'first_name' })
  declare firstName: string

  @column({ columnName: 'last_name' })
  declare lastName: string

  @column()
  declare email: string | null

  @column()
  declare phone: string

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Address, {
    foreignKey: 'customerId',
  })
  declare addresses: HasMany<typeof Address>

  @hasMany(() => Order, {
    foreignKey: 'customerId',
  })
  declare orders: HasMany<typeof Order>

  @beforeCreate()
  static async beforeCreate(customer: Customer) {
    customer.id = crypto.randomUUID()
  }
}
