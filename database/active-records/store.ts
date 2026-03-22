import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'
import { StoreStatusEnum } from '#kernel/store/domain/types/store_status'
import StoreBusinessHours from '#database/active-records/store_business_hours'
import { type HasMany } from '@adonisjs/lucid/types/relations'

export default class Store extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column()
  declare address: {
    street: string
    city: string
    country?: string
    postalCode?: string
    region?: string
  }

  @column()
  declare phoneContact1: { countryCode: string; number: string }

  @column()
  declare phoneContact2: { countryCode: string; number: string } | null

  @column({ columnName: 'whatsapp_contact' })
  declare whatsAppContact: { countryCode: string; number: string } | null

  @column()
  declare status: StoreStatusEnum

  @column({ columnName: 'status_reason' })
  declare statusReason: string | null

  @hasMany(() => StoreBusinessHours, {
    foreignKey: 'storeId',
  })
  declare businessHours: HasMany<typeof StoreBusinessHours>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async generate(store: Store) {
    store.id = crypto.randomUUID()
  }
}
