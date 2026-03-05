import { DateTime } from 'luxon'
import { afterFind, afterFetch, BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'
import Address from '#database/active-records/address'

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

  declare addresses: Address[]

  @beforeCreate()
  static async beforeCreate(customer: Customer) {
    customer.id = crypto.randomUUID()
  }

  @afterFind()
  static async afterFind(customer: Customer) {
    customer.addresses = await Address.query().where('customer_id', customer.id)
  }

  @afterFetch()
  static async afterFetch(customers: Customer[]) {
    await Promise.all(
      customers.map(async (customer) => {
        customer.addresses = await Address.query().where('customer_id', customer.id)
      })
    )
  }
}
