import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import Customer from '#database/active-records/customer'
import OrderItem from '#database/active-records/order_item'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'order_number' })
  declare orderNumber: string

  @column({ columnName: 'customer_id' })
  declare customerId: crypto.UUID | null

  @column()
  declare status: string

  // Shipping Address
  @column({ columnName: 'shipping_first_name' })
  declare shippingFirstName: string

  @column({ columnName: 'shipping_last_name' })
  declare shippingLastName: string

  @column({ columnName: 'shipping_phone' })
  declare shippingPhone: string | null

  @column({ columnName: 'shipping_address_line1' })
  declare shippingAddressLine1: string

  @column({ columnName: 'shipping_address_line2' })
  declare shippingAddressLine2: string | null

  @column({ columnName: 'shipping_city' })
  declare shippingCity: string

  @column({ columnName: 'shipping_state' })
  declare shippingState: string | null

  @column({ columnName: 'shipping_postal_code' })
  declare shippingPostalCode: string | null

  @column({ columnName: 'shipping_country' })
  declare shippingCountry: string

  // Pricing
  @column()
  declare subtotal: number

  @column({ columnName: 'shipping_fee' })
  declare shippingFee: number

  @column()
  declare total: number

  // Notes
  @column({ columnName: 'customer_notes' })
  declare customerNotes: string | null

  @column({ columnName: 'admin_notes' })
  declare adminNotes: string | null

  // Status timestamps
  @column.dateTime({ columnName: 'confirmed_at' })
  declare confirmedAt: DateTime | null

  @column.dateTime({ columnName: 'shipped_at' })
  declare shippedAt: DateTime | null

  @column.dateTime({ columnName: 'delivered_at' })
  declare deliveredAt: DateTime | null

  @column.dateTime({ columnName: 'cancelled_at' })
  declare cancelledAt: DateTime | null

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Customer, {
    foreignKey: 'customerId',
  })
  declare customer: BelongsTo<typeof Customer>

  @hasMany(() => OrderItem, {
    foreignKey: 'orderId',
  })
  declare items: HasMany<typeof OrderItem>

  @beforeCreate()
  static async beforeCreate(order: Order) {
    order.id = crypto.randomUUID()
  }
}
