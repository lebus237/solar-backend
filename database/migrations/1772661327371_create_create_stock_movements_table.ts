import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_movements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table
        .uuid('product_id')
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .notNullable()

      table.string('operation_type', 20).notNullable() // ADD, REMOVE, SET
      table.integer('quantity').notNullable()
      table.integer('previous_quantity').notNullable()
      table.integer('new_quantity').notNullable()
      table.string('reason', 255).nullable()

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
