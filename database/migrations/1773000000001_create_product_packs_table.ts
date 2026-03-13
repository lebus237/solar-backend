import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_packs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table.string('designation', 255).notNullable()
      table.string('slug', 255).unique().notNullable()
      table.text('description').nullable()

      table.double('price').notNullable().unsigned()

      table
        .uuid('main_image_id')
        .references('id')
        .inTable('image_medias')
        .onDelete('SET NULL')
        .nullable()

      table.integer('stock_quantity').nullable()
      table.integer('low_stock_threshold').defaultTo(10)

      table.boolean('is_available').defaultTo(false)
      table.boolean('is_deleted').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
