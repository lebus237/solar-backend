import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'store_business_hours'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()

      table.uuid('store_id').references('id').inTable('stores').onDelete('CASCADE').notNullable()
      table.string('day').notNullable()
      table.integer('open').notNullable()
      table.integer('close').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
