import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()
      table.string('product_slug').unique().notNullable()
      table
        .uuid('category_id')
        .references('id')
        .inTable('product_categories')
        .onDelete('CASCADE')
        .notNullable()

      table.string('designation', 255).unique().notNullable()
      table.string('description').notNullable()
      table.string('picture_url', 255).nullable()

      table.double('price').notNullable().unsigned()

      table.string('brand', 255).nullable()

      table.boolean('is_available').notNullable().defaultTo(false)
      table.boolean('is_deleted').notNullable().defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
