import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'

export default class Store extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column()
  declare description: string

  @column({ columnName: 'domain_url' })
  declare domainUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
