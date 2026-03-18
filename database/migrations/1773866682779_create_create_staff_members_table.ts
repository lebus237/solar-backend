import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'staff_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')

      table.string('full_name').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('phone').nullable()
      table.json('emergency_contact').nullable()

      table.string('job_title').notNullable()
      table.string('department').nullable()
      table.enum('employment_type', ['full_time', 'part_time', 'contract']).notNullable()
      table.enum('role', ['admin', 'manager', 'staff']).notNullable()
      table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')

      table
        .uuid('profile_image_id')
        .references('id')
        .inTable('image_medias')
        .onDelete('SET NULL')
        .nullable()
      table.string('profile_image_url').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
