import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'market_services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table.string('service_slug').unique().notNullable()

      table.string('designation', 255).unique().notNullable()
      table.string('short_description').notNullable()
      table.json('content_description').notNullable()

      table.string('thumbnail_url', 255).nullable()
      table.json('features_list').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
