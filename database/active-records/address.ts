import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import Customer from '#database/active-records/customer'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'customer_id' })
  declare customerId: crypto.UUID

  @column()
  declare type: string

  @column({ columnName: 'address_line1' })
  declare addressLine1: string

  @column({ columnName: 'address_line2' })
  declare addressLine2: string | null

  @column()
  declare city: string

  @column()
  declare state: string | null

  @column({ columnName: 'postal_code' })
  declare postalCode: string | null

  @column()
  declare country: string

  @column({ columnName: 'is_default' })
  declare isDefault: boolean

  @belongsTo(() => Customer, {
    foreignKey: 'customerId',
  })
  declare customer: BelongsTo<typeof Customer>

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async beforeCreate(address: Address) {
    address.id = crypto.randomUUID()
  }
}
