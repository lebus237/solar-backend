import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import User from '#database/active-records/user'
import ImageMedia from '#database/active-records/image_media'

export type StaffRole = 'admin' | 'manager' | 'staff'
export type EmploymentType = 'full_time' | 'part_time' | 'contract'
export type StaffStatus = 'active' | 'inactive'

export default class StaffMember extends BaseModel {
  static table = 'staff_members'

  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'user_id' })
  declare userId: crypto.UUID | null

  @column({ columnName: 'full_name' })
  declare fullName: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column({ columnName: 'emergency_contact' })
  declare emergencyContact: { name: string; phone: string } | null

  @column({ columnName: 'job_title' })
  declare jobTitle: string

  @column()
  declare department: string | null

  @column({ columnName: 'employment_type' })
  declare employmentType: EmploymentType

  @column()
  declare role: StaffRole

  @column()
  declare status: StaffStatus

  @column({ columnName: 'profile_image_id' })
  declare profileImageId: crypto.UUID | null

  @column({ columnName: 'profile_image_url' })
  declare profileImageUrl: string | null

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

  @belongsTo(() => ImageMedia, {
    foreignKey: 'profileImageId',
  })
  declare profileImage: BelongsTo<typeof ImageMedia>

  @beforeCreate()
  static async beforeCreate(staffMember: StaffMember) {
    staffMember.id = crypto.randomUUID()
  }
}
